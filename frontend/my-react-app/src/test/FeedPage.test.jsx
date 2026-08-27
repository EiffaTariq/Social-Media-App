import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedPage from "../pages/FeedPage.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

vi.mock("../context/PostsContext.jsx", () => ({ usePosts: vi.fn() }));
vi.mock("../context/AuthContext.jsx", () => ({ useAuth: vi.fn() }));
vi.mock("../context/UIContext.jsx", () => ({ useUI: vi.fn() }));

describe("FeedPage — post visibility", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { _id: "user1" } });
    useUI.mockReturnValue({ openPost: vi.fn() });
  });

  it("shows skeleton loaders while loading", () => {
    usePosts.mockReturnValue({ posts: [], loading: true, error: null });
    const { container } = render(<FeedPage />);
    expect(container.querySelectorAll(".masonry > *").length).toBe(6);
  });

  it("shows an error message when the posts fail to load", () => {
    usePosts.mockReturnValue({ posts: [], loading: false, error: "Failed to fetch posts" });
    render(<FeedPage />);
    expect(screen.getByText("Failed to fetch posts")).toBeInTheDocument();
  });

  it("shows an empty state when there are no posts", () => {
    usePosts.mockReturnValue({ posts: [], loading: false, error: null });
    render(<FeedPage />);
    expect(
      screen.getByText("No posts yet. Follow people or create your first post to see it here.")
    ).toBeInTheDocument();
  });

  it("renders one PostCard per post when posts are available", () => {
    const posts = [
      { _id: "p1", caption: "Post one", likes: [], owner: { name: "Ali" } },
      { _id: "p2", caption: "Post two", likes: [], owner: { name: "Sara" } },
    ];
    usePosts.mockReturnValue({ posts, loading: false, error: null });
    render(<FeedPage />);
    expect(screen.getByText("Post one")).toBeInTheDocument();
    expect(screen.getByText("Post two")).toBeInTheDocument();
  });
});