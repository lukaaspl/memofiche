import { fireEvent } from "@testing-library/react";
import { render, screen } from "test-utils";
import StudyTimeChart from "../study-time-chart";

describe("<StudyTimeChart />", () => {
  test("displays and hides loading spinner when data is synced", () => {
    const { rerender } = render(
      <StudyTimeChart data={[]} isRefetching={true} />
    );

    const loadingSpinner = screen.getByRole("progressbar");

    rerender(<StudyTimeChart data={[]} isRefetching={false} />);

    expect(loadingSpinner).not.toBeInTheDocument();
  });

  test("toggles between total and average mode", () => {
    render(<StudyTimeChart data={[]} isRefetching={false} />);

    expect(screen.getByText("Total study time"));
    expect(screen.queryByText("Avg. study time")).not.toBeInTheDocument();

    const avgModeButton = screen.getByRole("button", { name: /avg/i });

    fireEvent.click(avgModeButton);

    expect(screen.getByText("Avg. study time"));
    expect(screen.queryByText("Total study time")).not.toBeInTheDocument();
  });
});
