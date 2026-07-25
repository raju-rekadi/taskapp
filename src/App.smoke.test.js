import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";

test("renders populated results and expands a student", async () => {
  render(<App />);

  // Header + stats strip
  expect(screen.getByText(/B\.Sc\. Computer Science Results/i)).toBeInTheDocument();
  expect(screen.getByText(/Showing 21 of 21 students/i)).toBeInTheDocument();
  expect(screen.getByText(/Provisional results sourced/i)).toBeInTheDocument();

  // Expand MEDA VENKATA SATISH and check semester 6 renders
  const card = screen.getByText("MEDA VENKATA SATISH").closest("button");
  fireEvent.click(card);

  const article = card.closest("article");
  expect(within(article).getAllByText(/UNIX SYSTEM PROGRAMMING/i).length).toBeGreaterThan(0);
  // 6.20 shows both on the Sem 6 pill and in the SGPA summary
  expect(within(article).getAllByText("6.20").length).toBeGreaterThan(0);

  // Switch to semester 5 (the merged supply result)
  fireEvent.click(within(article).getByTitle("Semester 5"));
  expect(within(article).getAllByText(/OPERATING SYSYTEMS/i).length).toBeGreaterThan(0);
  expect(within(article).getAllByText("6.44").length).toBeGreaterThan(0);
});

test("search filters the list", () => {
  render(<App />);
  fireEvent.change(screen.getByPlaceholderText(/Search name or roll number/i), {
    target: { value: "23CS0309" },
  });
  expect(screen.getByText(/Showing 1 of 21 students/i)).toBeInTheDocument();
  expect(screen.getByText("KURACHA RAMA SESHA MANIDEEP")).toBeInTheDocument();
});
