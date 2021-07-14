import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, getByTestId, queryByText, queryByAltText } from "@testing-library/react";
import axios from "axios";

import Application from "components/Application";

afterEach(cleanup);
describe("Application", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  test("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  test("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  test("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Are you sure you want to delete?")
    ).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(queryByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  test("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
    debug();

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const interview = getAllByTestId(container, "appointment").find(
      interview => queryByText(interview, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(interview, "Edit"));

    fireEvent.change(getByPlaceholderText(interview, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(interview, "Sylvia Palmer"));

    fireEvent.click(getByText(container, "Save"));

    expect(getByText(container, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  test("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const interview = getAllByTestId(container, "appointment").find(
      interview => queryByText(interview, "Archie Cohen")
    );

    fireEvent.click(getByAltText(interview, "Edit"));

    fireEvent.change(getByPlaceholderText(interview, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(interview, "Sylvia Palmer"));

    fireEvent.click(getByText(interview, "Save"));

    expect(getByText(interview, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Couldn't Save please try again"));

    expect(getByText(container, "Couldn't Save please try again")).toBeInTheDocument();
  });

  test("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const interview = getAllByTestId(container, "appointment").find(
      interview => queryByText(interview, "Archie Cohen")
    );

    fireEvent.click(getByAltText(interview, "Delete"));

    expect(getByText(interview, "Are you sure you want to delete?")).toBeInTheDocument();

    fireEvent.click(getByText(interview, "Confirm"));

    expect(getByText(interview, "Deleting...")).toBeInTheDocument();

    await waitForElement(() => getByText(interview, "Couldn't Delete please try again"));

    expect(getByText(interview, "Couldn't Delete please try again")).toBeInTheDocument();
  });
});