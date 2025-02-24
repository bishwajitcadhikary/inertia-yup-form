import { describe, it, expect, vi } from "vitest";
import { useForm } from "../useForm";
import * as yup from "yup";
import { ref, nextTick } from "vue";

describe("useForm", () => {
    const schema = yup.object().shape({
        name: yup.string().required("Name is required"),
        email: yup.string().email("Invalid email format").required("Email is required"),
    });

    const formData = ref({
        name: "",
        email: "",
    });

    it("should start with an empty form and no errors", () => {
        const form = useForm(schema, formData.value);

        expect(form.name).toBe("");
        expect(form.email).toBe("");
        expect(form.errors.name).toBeUndefined();
        expect(form.errors.email).toBeUndefined();
    });

    it("should validate and set errors when fields are invalid", async () => {
        const form = useForm(schema, formData.value);

        form.name = null;
        form.email = "invalid-email";

        await nextTick();

        expect(form.errors.name).toBe("Name is required");
        expect(form.errors.email).toBe("Invalid email format");
    });

    it("should clear errors when fields become valid", async () => {
        const form = useForm(schema, formData.value);

        form.name = "John Doe";
        form.email = "john@example.com";

        await nextTick();

        expect(form.errors.name).toBeUndefined();
        expect(form.errors.email).toBeUndefined();
    });

    it("should prevent form submission if there are validation errors", async () => {
        const form = useForm(schema, formData.value);

        form.name = null;
        form.email = "invalid-email";

        await nextTick();

        const postMock = vi.spyOn(form, "post").mockImplementation(() => {});

        form.submit("post", "/submit");

        expect(postMock).not.toHaveBeenCalled();
        expect(form.errors.name).toBe("Name is required");
        expect(form.errors.email).toBe("Invalid email format");

        postMock.mockRestore();
    });

    it("should allow form submission if validation passes", async () => {
        const form = useForm(schema, formData.value);

        form.name = "Jane Doe";
        form.email = "jane@example.com";

        await nextTick();

        const postMock = vi.spyOn(form, "post").mockImplementation(() => {});

        form.post("/submit");

        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith("/submit");

        expect(form.errors.name).toBeUndefined();
        expect(form.errors.email).toBeUndefined();

        postMock.mockRestore();
    });
});