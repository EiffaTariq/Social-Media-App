import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPostForm from "../components/EditPostForm.jsx";

// FileUpload has its own upload/preview logic unrelated to form validation,
// so we stub it out with a lightweight placeholder.
vi.mock("../components/FileUpload", () => ({
  default: () => <div data-testid="file-upload-stub" />,
}));

describe("EditPostForm", () => {
  const basePost = {
    caption: "Original caption",
    visibility: "public",
    location: "Lahore",
    eventDate: "",
    altText: "",
    image: null,
  };

  it("pre-fills the form fields from the post prop", () => {
    render(<EditPostForm post={basePost} onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByDisplayValue("Original caption")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lahore")).toBeInTheDocument();
  });

  it("shows an error when the caption is cleared", async () => {
    const user = userEvent.setup();
    render(<EditPostForm post={basePost} onSubmit={vi.fn()} onClose={vi.fn()} />);

    const captionBox = screen.getByDisplayValue("Original caption");
    await user.clear(captionBox);
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Caption is required")).toBeInTheDocument();
  });

  it("shows an error when the caption is too short", async () => {
    const user = userEvent.setup();
    render(<EditPostForm post={basePost} onSubmit={vi.fn()} onClose={vi.fn()} />);

    const captionBox = screen.getByDisplayValue("Original caption");
    await user.clear(captionBox);
    await user.type(captionBox, "hi");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Caption must be at least 3 characters")).toBeInTheDocument();
  });

  it("rejects an event date set in the future", async () => {
    const user = userEvent.setup();
    render(<EditPostForm post={basePost} onSubmit={vi.fn()} onClose={vi.fn()} />);

    const dateInput = document.querySelector('input[type="date"]');
    await user.type(dateInput, "2099-01-01");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Date cannot be in the future")).toBeInTheDocument();
  });

  it("calls onSubmit with trimmed values when the form is valid", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValueOnce();
    render(<EditPostForm post={basePost} onSubmit={mockSubmit} onClose={vi.fn()} />);

    const captionBox = screen.getByDisplayValue("Original caption");
    await user.clear(captionBox);
    await user.type(captionBox, "  Updated caption  ");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ caption: "Updated caption", visibility: "public" })
    );
  });
});