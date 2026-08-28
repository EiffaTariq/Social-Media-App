import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TopBar from "../components/TopBar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { searchUsers } from "../api.js";

vi.mock("../context/AuthContext.jsx", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useAuth: vi.fn() };
});
vi.mock("../context/UIContext.jsx", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useUI: vi.fn() };
});
vi.mock("../api.js", () => ({ searchUsers: vi.fn() }));

describe("TopBar — search filtering", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ logout: vi.fn() });
    useUI.mockReturnValue({ openProfile: vi.fn() });
  });

  it("does not call searchUsers when the input is empty", async () => {
    render(<TopBar />);
    await new Promise((r) => setTimeout(r, 350)); // past the 300ms debounce
    expect(searchUsers).not.toHaveBeenCalled();
  });

  it("calls searchUsers with the typed query after the debounce", async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValueOnce([]);
    render(<TopBar />);

    await user.type(screen.getByPlaceholderText("Search people by username…"), "ali");

    await waitFor(() => expect(searchUsers).toHaveBeenCalledWith("ali"), { timeout: 1000 });
  });

  it("renders matching users returned from the search", async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValueOnce([
      { _id: "u1", name: "Ali Khan", username: "ali_k" },
    ]);
    render(<TopBar />);

    await user.type(screen.getByPlaceholderText("Search people by username…"), "ali");

    expect(await screen.findByText("Ali Khan")).toBeInTheDocument();
    expect(screen.getByText("@ali_k")).toBeInTheDocument();
  });

  it("shows 'No users found' when the search returns an empty array", async () => {
    const user = userEvent.setup();
    searchUsers.mockResolvedValueOnce([]);
    render(<TopBar />);

    await user.type(screen.getByPlaceholderText("Search people by username…"), "zzz");

    expect(await screen.findByText("No users found")).toBeInTheDocument();
  });

  it("calls openProfile and clears the query when a result is selected", async () => {
    const user = userEvent.setup();
    const mockOpenProfile = vi.fn();
    useUI.mockReturnValue({ openProfile: mockOpenProfile });
    searchUsers.mockResolvedValueOnce([{ _id: "u1", name: "Ali Khan", username: "ali_k" }]);
    render(<TopBar />);

    const input = screen.getByPlaceholderText("Search people by username…");
    await user.type(input, "ali");
    const result = await screen.findByText("Ali Khan");
    await user.click(result);

    expect(mockOpenProfile).toHaveBeenCalledWith("u1");
    expect(input).toHaveValue("");
  });
});