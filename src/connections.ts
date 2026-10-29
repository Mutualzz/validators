import z from "zod";

// A blank or invalid returnTo falls back to the default redirect in the controller
export const oauthStartBody = z.object({
  returnTo: z.string().trim().min(1).max(2048).optional().catch(undefined),
});

export const spotifyOAuthCompleteBody = z.object(
  {
    code: z.string().min(1, { error: "Missing code or state" }),
    state: z.string().min(1, { error: "Missing code or state" }),
  },
  { error: "Missing code or state" },
);

export const spotifyPatchBody = z.object(
  {
    shareSpotify: z.boolean({ error: "shareSpotify is required" }),
  },
  { error: "shareSpotify is required" },
);

export const connectionOAuthCompleteBody = z.object(
  {
    // Checked against the provider list in the controller
    provider: z.string().optional().catch(undefined),
    state: z.string().min(1, { error: "Missing code or state" }),
    code: z.string().optional().catch(undefined),
    iss: z.string().optional().catch(undefined),
    // Non-string values are dropped
    openid: z
      .record(z.string(), z.unknown())
      .transform((raw) =>
        Object.fromEntries(
          Object.entries(raw).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        ),
      )
      .optional()
      .catch(undefined),
  },
  { error: "Missing code or state" },
);

export const connectionPatchBody = z.object(
  {
    shareOnProfile: z.boolean({ error: "shareOnProfile is required" }),
  },
  { error: "shareOnProfile is required" },
);
