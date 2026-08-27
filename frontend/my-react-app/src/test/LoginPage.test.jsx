import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../pages/LoginPage.jsx";
import { useAuth } from "../context/AuthContext.jsx";

vi.mock("../context/AuthContext.jsx", () => ({
  useAuth: vi.fn(),
}));

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  it("renders email and password fields with a submit button", () => {
    render(<LoginPage onSwitchToSignup={vi.fn()} />);
    expect(screen.getByPlaceholderText("you@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<LoginPage onSwitchToSignup={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("shows an error for an invalid email and a short password", async () => {
    const user = userEvent.setup();
    render(<LoginPage onSwitchToSignup={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("you@gmail.com"), "not-an-email");
    await user.type(screen.getByPlaceholderText("••••••••"), "123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(screen.getByText("Password must be at least 6 characters")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("calls login with the entered credentials when the form is valid", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce();
    render(<LoginPage onSwitchToSignup={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("you@gmail.com"), "eiffa@test.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(mockLogin).toHaveBeenCalledWith("eiffa@test.com", "password123");
  });

  it("displays a server error message when login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<LoginPage onSwitchToSignup={vi.fn()} />);

    await user.type(screen.getByPlaceholderText("you@gmail.com"), "eiffa@test.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});