import { z } from "zod";

export const DisplayName = z.string().min(3).max(50);
export const Status = z.string().min(1).max(160);
export const Bio = z.string().min(1).max(280);
export const Email = z.string().email().max(50);
export const Password = z.string().min(8).max(64);

export const SetTheme = z.object({
    "colorScheme": z.enum(["dark", "light"])
});
