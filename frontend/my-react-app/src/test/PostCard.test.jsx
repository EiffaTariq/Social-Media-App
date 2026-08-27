import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { useUI } from "../context/UIContext.jsx";

vi.mock("../context/AuthContext.jsx", () => ({ useAuth: vi.fn() }));
vi.mock("../context/PostsContext.jsx", () => ({ usePosts: vi.fn() }));
vi.mock("../context/UIContext.jsx", () => ({ useUI: vi.fn() }));

describe("PostCard", () => {
  const mockToggleLike = vi.fn();
  const mockOpenPost = vi.fn();

  const post = {
    _id: "post1",
    caption: "My first post",
    image: "https://example.com/img.jpg",
    likes: ["user2"],
    owner: { name: "Ali Khan" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { _id: "user1" } });
    usePosts.mockReturnValue({ toggleLike: mockToggleLike });
    useUI.mockReturnValue({ openPost: mockOpenPost });
  });

  it("renders the caption, author name, and like count", () => {
    render(<PostCard p={post} />);
    expect(screen.getByText("My first post")).toBeInTheDocument();
    expect(screen.getByText("Ali Khan")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows the liked state when the current user is in the likes array", () => {
    const likedPost = { ...post, likes: ["user1", "user2"] };
    render(<PostCard p={likedPost} />);
    expect(screen.getByRole("button", { name: /2/ })).toHaveClass("liked");
  });

  it("calls openPost with the post when the card is clicked", async () => {
    const user = userEvent.setup();
    render(<PostCard p={post} />);

    await user.click(screen.getByText("My first post"));
    expect(mockOpenPost).toHaveBeenCalledWith(post);
  });

  it("calls toggleLike with post id and user id when the like button is clicked", async () => {
    const user = userEvent.setup();
    render(<PostCard p={post} />);

    await user.click(screen.getByRole("button", { name: /1/ }));
    expect(mockToggleLike).toHaveBeenCalledWith("post1", "user1");
  });

  it("does not open the post when the like button is clicked (event should not bubble)", async () => {
    const user = userEvent.setup();
    render(<PostCard p={post} />);

    await user.click(screen.getByRole("button", { name: /1/ }));
    expect(mockOpenPost).not.toHaveBeenCalled();
  });
});