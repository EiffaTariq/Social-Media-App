import { Activity } from "react";
import { describe, it } from "vitest";

describe("Activity", ()=>{
    it("returns posts made by users",()=>{
        expect(Activity).toBe("post");
    });
});