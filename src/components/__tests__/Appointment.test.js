import React from "react";
import { render } from "@testing-library/react";
import Application from "components/Application";

describe('Application test suite', () => {
  test("renders without crashing", () => {
    render(<Application />);
  })
});

