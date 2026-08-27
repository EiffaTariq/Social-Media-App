import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostFormModal from "../components/PostFormModal.jsx";
import { uploadFile } from "../api.js";

// api.js makes real HTTP calls — mock it so file upload doesn't hit a network.
vi.mock("../api", () => ({
  uploadFile: vi.fn(),
}));

describe("PostFormModal", () => {
  it("renders 'Add post' title in create mode and 'Update post' in edit mode", () => {
    const { rerender } = render(
      <PostFormModal onSubmit={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText("Add post")).toBeInTheDocument();

    rerender(
      <PostFormModal initialData={{ caption: "old" }} onSubmit={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText("Update post")).toBeInTheDocument();
  });

  it("lets the user type a caption", async () => {
    const user = userEvent.setup();
    render(<PostFormModal onSubmit={vi.fn()} onClose={vi.fn()} />);

    const textarea = screen.getByPlaceholderText("Write a caption...");
    await user.type(textarea, "Sunset at the beach");
    expect(textarea).toHaveValue("Sunset at the beach");
  });

  it("submits the caption and uploaded image url, then closes the modal", async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn().mockResolvedValueOnce();
    const mockClose = vi.fn();
    render(<PostFormModal onSubmit={mockSubmit} onClose={mockClose} />);

    await user.type(screen.getByPlaceholderText("Write a caption..."), "Hello world");
    await user.click(screen.getByRole("button", { name: "Post" }));

    expect(mockSubmit).toHaveBeenCalledWith({ cap: "Hello world", img: null });
    expect(mockClose).toHaveBeenCalled();
  });

  it("shows a file size error for an image over 5MB without calling uploadFile", async () => {
    const user = userEvent.setup();
    render(<PostFormModal onSubmit={vi.fn()} onClose={vi.fn()} />);

    const bigFile = new File([new ArrayBuffer(6 * 1024 * 1024)], "big.jpg", {
      type: "image/jpeg",
    });
    const input = document.querySelector('input[type="file"]');
    await user.upload(input, bigFile);

    expect(await screen.findByText("Image must be smaller than 5MB")).toBeInTheDocument();
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it("closes the modal when the overlay is clicked, without triggering submit", async () => {
    const user = userEvent.setup();
    const mockClose = vi.fn();
    const mockSubmit = vi.fn();
    const { container } = render(<PostFormModal onSubmit={mockSubmit} onClose={mockClose} />);

    await user.click(container.querySelector(".modal-overlay"));

    expect(mockClose).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});