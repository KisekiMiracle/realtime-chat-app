import { Elysia, t } from "elysia";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";

const app = new Elysia({
  prefix: "/api",
});
app.use(
  cors({
    origin: ["http://localhost:300"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    maxAge: 60,
    credentials: true,
    allowedHeaders: ["Content-Type", "Set-Cookies"],
  }),
);
app.use(
  jwt({
    name: "jwt",
    secret: "YCZ1p28ctVMpBVmrvxobAm4EeVIMcgkw3ZlGOG6Iefq",
  }),
);

export const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// =======================================
// NOTE: TEST API ROUTES
// =======================================
app.get("/test/params/:id", async ({ params: { id } }) => {
  console.log("You sent: ", id);
  const res = await client.query(/* sql */ `
    SELECT * FROM "user"
  `);
  return { success: true, response: res.rows };
});
// =======================================
// NOTE: POST API ROUTES
// =======================================
app.get("/posts/latest", async ({ set }) => {
  try {
    const latestPosts = (
      await client.query(/* sql */ `
        SELECT 
          forum_posts.id,
          forum_posts.title,
          forum_posts.content,
          forum_posts.views,
          forum_posts.reply_count,
          forum_posts.is_pinned,
          forum_posts.is_locked,
          forum_posts.created_at,
          forum_posts.last_reply_at,
          u1.name AS author_name,
          u2.name AS last_reply_by_name,
          fc.name AS category_name,
          fc.slug AS category_slug
        FROM forum_posts
        LEFT JOIN "user" u1 ON forum_posts.author_id = u1.id
        LEFT JOIN "user" u2 ON forum_posts.last_reply_by = u2.id
        LEFT JOIN forum_categories fc ON forum_posts.category_id = fc.id
        ORDER BY COALESCE(forum_posts.last_reply_at, forum_posts.created_at) DESC
        LIMIT 8;
    `)
    ).rows;
    console.log("tried to fecth posts", latestPosts);

    set.status = 201;
    return latestPosts;
  } catch (error) {
    set.status = 500;
    console.error(error);
    return { error: `Something unexpected happened. Reason: ${error}` };
  }
});
// =======================================
// NOTE: AUTH API ROUTES
// =======================================
app.post(
  "/auth/signup",
  async ({ body, set }) => {
    const { username, email, password } = body;

    try {
      await client.query("BEGIN");

      const checkExistingUser = await client.query(
        /* sql */ `
        SELECT * FROM "user"
        WHERE email=$1
    `,
        [email],
      );

      if (checkExistingUser.rows.length !== 0) {
        set.status = 409;
        return { message: "User with that email already exists." };
      }

      const hashedPassword = await bcrypt.hash(
        password,
        await bcrypt.genSalt(10),
      );

      const { id } = (
        await client.query(
          /* sql */ `
      INSERT INTO "user" (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id;
    `,
          [username, email, hashedPassword],
        )
      ).rows[0];

      await client.query(
        /* sql */ `
        INSERT INTO user_profile (id, name, email)
        VALUES ($1, $2, $3);
      `,
        [id, username, email],
      );

      await client.query("COMMIT");
      set.status = 201;
      return { success: "Account created successfully!" };
    } catch (error) {
      await client.query("ROLLBACK");
      set.status = 500;
      return { message: "Undefined error: " + error };
    }
  },
  {
    body: t.Object({
      username: t.String(),
      email: t.String(),
      password: t.String(),
      confirm_password: t.String(),
    }),
  },
);
app.post(
  "/auth/signin",
  // @ts-expect-error
  async ({ jwt, body, cookie: { accessToken, refreshToken }, set }) => {
    const { email, password } = body;
    const user = (
      await client.query(
        /* sql */ `
      SELECT * FROM "user"
      WHERE email=$1
    `,
        [email],
      )
    ).rows[0];

    if (!user) {
      set.status = 400;
      return {
        message:
          "The provided email address is incorrect or is not associated with an existing user.",
      };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      set.status = 400;
      return { message: "The provided password is incorrect." };
    }

    const jwtAccessToken = await jwt.sign({ sub: user.id, exp: 60 * 60 * 24 });
    accessToken.set({
      value: jwtAccessToken,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });

    const jwtRefreshToken = await jwt.sign({
      sub: user.id,
      exp: 60 * 60 * 24 * 7,
    });
    refreshToken.set({
      value: jwtRefreshToken,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    // NOTE: Update User
    await client.query(
      /* sql */ `
      UPDATE "user"
        SET access_token=$1, refresh_token=$2
        WHERE id=$3;
    `,
      [jwtAccessToken, jwtRefreshToken, user.id],
    );

    set.status = 200;
    return { message: "Signed In! Redirecting you..." };
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  },
);
app.get(
  "/auth/validate-user",
  // @ts-expect-error
  async ({ cookie: { accessToken, refreshToken }, set, jwt }) => {
    const findByAccessToken = (
      await client.query(
        /* sql */ `
    SELECT id, name, email, role, created_at, updated_at, access_token FROM "user"
    WHERE access_token=$1;
  `,
        [accessToken.value],
      )
    ).rows[0];

    if (!findByAccessToken) {
      const findByRefreshToken = (
        await client.query(
          /* sql */ `
      SELECT id, name, email, role, created_at, updated_at FROM "user"
      WHERE refresh_token=$1;
    `,
          [refreshToken.value],
        )
      ).rows[0];

      if (!findByRefreshToken) {
        set.status = 401;
        return { error: "unauthenticated" };
      }

      const jwtAccessToken = await jwt.sign({
        sub: findByRefreshToken.id,
        exp: 60 * 60 * 24,
      });
      accessToken.set({
        value: jwtAccessToken,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      });

      // NOTE: Update User
      await client.query(
        /* sql */ `
      UPDATE "user"
        SET access_token=$1, updated_at=$2
        WHERE id=$3;
    `,
        [jwtAccessToken, new Date(), findByRefreshToken.id],
      );

      set.status = 200;
      return { user: findByRefreshToken, accessToken: jwtAccessToken };
    }

    set.status = 200;
    return {
      user: findByAccessToken,
      accessToken: findByAccessToken.access_token,
    };
  },
);
app.get("/auth/me", async ({ set, cookie: { accessToken, refreshToken } }) => {
  try {
    const user = (
      await client.query(
        /* sql */ `
      SELECT id FROM "user"
      WHERE access_token=$1 OR refresh_token=$2;
    `,
        [accessToken.value, refreshToken.value],
      )
    ).rows[0];

    if (!user) {
      set.status = 401;
      return { message: "Session for this user has expired." };
    }

    const profile = (
      await client.query(
        /* sql */ `
          SELECT * from user_profile
          WHERE id=$1;
        `,
        [user.id],
      )
    ).rows[0];

    set.status = 200;
    return { user: profile };
  } catch (error) {
    set.status = 500;
    return { message: "Something unexpected happened." };
  }
});
// =======================================
export const GET = app.fetch;
export const POST = app.fetch;
