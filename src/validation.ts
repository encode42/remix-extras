import { z } from "zod";
import { TablerIconsKeys, TablerIconsType } from "@encode42/tabler-icons-types";

export const DisplayName = z.string().min(3).max(50);
export const Status = z.string().min(1).max(160);
export const Bio = z.string().min(1).max(280);
export const Email = z.string().email().max(50);
export const Password = z.string().min(8).max(64);

export const SetTheme = z.object({
    "colorScheme": z.enum(["dark", "light"])
});

export type TablerIconsArray = [TablerIconsType, ...TablerIconsType[]];
export const TablerIconsEnum = z.enum<TablerIconsType, TablerIconsArray>(TablerIconsKeys as TablerIconsArray);
