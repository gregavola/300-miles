import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { useState } from "react";
import { find } from "lodash";
import { WorkoutEvent } from "../utils/types";

export interface DefaultProps {
  events: WorkoutEvent[];
  onClick: any;
}

function CalendarComponent({ events, onClick }: DefaultProps) {
  const [value, onChange] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedItems, setSelectedItem] = useState([]);

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";

    console.log("render header");

    return (
      <div className="text-center mb-3">
        <h2>{format(currentMonth, dateFormat)}</h2>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "eee";
    const days = [];

    let startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(<th key={i}>{format(addDays(startDate, i), dateFormat)}</th>);
    }

    return (
      <thead>
        <tr className="text-center mb-5 mt-4 text-uppercase font-weight-bold">
          {days}
        </tr>
      </thead>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);

        const workoutFind = find(events, (item) => {
          return item.date === format(day, "yyyy-MM-dd");
        });

        days.push(
          <td
            className={`${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day.toString()}
          >
            <div
              className={`d-flex text-center font-weight-bold align-items-center justify-content-center mt-3 mb-3`}
            >
              {workoutFind && (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    onClick(workoutFind.items);
                  }}
                  className="number bg-primary text-light workout"
                >
                  {formattedDate}
                </a>
              )}
              {!workoutFind && <div className="number">{formattedDate}</div>}
            </div>
            {isSameDay(day, selectedDate) && (
              <div
                className="bg-danger text-align-center d-flex mt-3"
                style={{
                  width: 5,
                  padding: 2,
                  height: 5,
                  borderRadius: 10,
                  margin: "0px auto",
                }}
              ></div>
            )}
          </td>
        );
        day = addDays(day, 1);
      }
      rows.push(<tr key={`${day.toString()}-row`}>{days}</tr>);
      days = [];
    }
    return <tbody className="body">{rows}</tbody>;
  };

  return (
    <div>
      <div className="calendar">
        {renderHeader()}
        <table>
          {renderDays()}
          {renderCells()}
        </table>
      </div>
    </div>
  );
}

export default CalendarComponent;
