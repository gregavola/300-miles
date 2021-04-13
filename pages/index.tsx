import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CalendarComponent from "../components/Calendar";
import ProgressBarComponent from "../components/ProgressBar";
import { Modal } from "react-bootstrap";
import { Facebook, Activity, Heart } from "react-feather";
import { FrontPage, Workout, WorkoutEvent } from "../utils/types";
import { getFrontPage } from "../utils/getFrontPage";
import { format } from "date-fns";
import Layout from "../components/Layout";

export interface DefaultProps {
  frontPageData: FrontPage;
}

export async function getServerSideProps(context) {
  const frontPageData = await getFrontPage();

  return {
    props: { frontPageData },
  };
}

export default function Home({ frontPageData }: DefaultProps) {
  const [fontPage, setFrontPage] = useState<FrontPage>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout[]>(null);
  const [mostRecentWorkouts, setMostRecentWorkouts] = useState<Workout[]>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setFrontPage(frontPageData);
    setMostRecentWorkouts(frontPageData.mostRecentWorkouts);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Layout>
      {selectedWorkout && (
        <Modal
          show={isModalOpen}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={closeModal}
        >
          <Modal.Header closeButton>
            <h5 className="mr-3 mb-0 text-uppercase font-weight-bold">
              <div className="d-flex align-items-center">
                <span>Day Detail</span>
              </div>
            </h5>
          </Modal.Header>
          <Modal.Body>
            {selectedWorkout.map((item: Workout) => {
              return (
                <div key={item.workoutId}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <div className="image">
                        <img
                          src={item.instructor.imageUrl}
                          className="rounded-circle"
                          height="50"
                          width="50"
                        />
                      </div>
                      <div className="info ml-lg-3">
                        <div style={{ fontSize: 16, fontWeight: "bold" }}>
                          {item.className}
                        </div>
                        <div
                          className="text-uppercase"
                          style={{
                            letterSpacing: 1,
                            fontSize: 13,
                          }}
                        >
                          {item.instructor.name}
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            letterSpacing: 1,
                            fontSize: 12,
                            marginTop: 0,
                            marginBottom: 0,
                          }}
                        >
                          {item.endTime && (
                            <>
                              <div>
                                {format(
                                  new Date(item.endTime),
                                  "E, LLL do @ h:mm aaaa"
                                )}
                              </div>
                              <div
                                style={{ fontSize: 13 }}
                                className="mt-2 badge badge-success"
                              >
                                COMPLETE
                              </div>
                            </>
                          )}

                          {!item.endTime && (
                            <>
                              <div>
                                Started At:
                                {format(
                                  new Date(item.startTime),
                                  "E, LLL do @ h:mm aaaa"
                                )}
                              </div>
                              <div
                                style={{ fontSize: 13 }}
                                className="mt-2 badge badge-danger"
                              >
                                LIVE
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="workout d-flex align-items-center justify-content-center">
                        <h3>{item.workOutput}</h3>
                        <span className="text-muted ml-1">kj</span>
                      </div>
                      <div className="workout d-flex align-items-center justify-content-center">
                        <h3>{item.totalMiles}</h3>
                        <span className="text-muted ml-1">mi</span>
                      </div>
                      <a
                        className="btn btn-danger btn-sm text-uppercase"
                        target="_blank"
                        href={`https://members.onepeloton.com/members/971407f7eb744e6da652d17b34e00137/workouts/${item.workoutId}`}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src="/pelo-icon.png"
                            height="20"
                            width="20 c"
                            className="mr-1"
                          />
                          Details
                        </div>
                      </a>
                    </div>
                  </div>
                  <hr />
                </div>
              );
            })}
          </Modal.Body>
        </Modal>
      )}

      <section className="hero">
        <div className="container">
          <div className="col-md-6 mx-auto text-center">
            <div className="pt-5 row d-flex flex-column justify-content-center pt-4">
              <div className="display-4 mb-3" style={{ letterSpacing: -1 }}>
                🚴‍♂️ Racing for a Cure
              </div>
              <h2>
                Join me as I race to 300 miles for the month of April on the
                Peloton, to raise donations for the American Cancer Society.
              </h2>
            </div>
            <div className="row pb-5 pt-5 justify-content-center">
              <div className="d-flex justify-content-center">
                <a
                  href="#donate"
                  className="text-decoration-none  d-block btn-lg btn-primary mr-3"
                >
                  <span className="d-flex align-items-center">
                    <Facebook className="mr-1" />
                    <span>Donate</span>
                  </span>
                </a>
                <a
                  href="#donate"
                  className="text-decoration-none  d-block btn-lg btn-primary "
                >
                  <span className="d-flex align-items-center">
                    <Activity className="mr-1" />
                    <span>Progress</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mt-5 mb-5">
        {fontPage && (
          <>
            <div className="mb-4 text-center" id="about">
              <h1>👋</h1>
              <h5>
                Hello, my name is{" "}
                <a href="https://twitter.com/gregavola" target="_blank">
                  Greg Avola
                </a>
                !
              </h5>
              <p>
                Cancer is among the leading causes of death worldwide. In 2018,
                there were 18.1 million new cases and 9.5 million cancer-related
                deaths worldwide. By 2040, the number of new cancer cases per
                year is expected to rise to 29.5 million and the number of
                cancer-related deaths to 16.4 million.
              </p>
              <p style={{ fontWeight: "bold" }}>
                Bottom line, we need to stand up to race for a cure.
              </p>
              <p>
                We can change this!{" "}
                <strong>
                  In April, I am hoping to raise $1000 to support the American
                  Cancer Society by riding 300 miles on my Peloton, and I am
                  asking for your support.
                </strong>{" "}
                I know that it's hard time for everyone with the current
                pandemic, but every little bit helps from $1 to $1000. You can
                follow the progress below and see live updates on my milage for
                the month. You can also{" "}
                <a href="#calendar">click the calendar</a> below to see what
                ride I took on Peloton for more details.
              </p>
              <hr />
            </div>
            <div id="donate" />
            <div className="mb-2 row">
              <div className="col-md-6 justify-content-center text-center">
                <h1>${fontPage.dontations.total}</h1>
                <p className="text-muted">Amount Raised ($1000 Goal)</p>
                <ProgressBarComponent
                  total={1000}
                  current={fontPage.dontations.total}
                  size={"50px"}
                />
                <a
                  href="https://www.facebook.com/donate/471197067403150/"
                  target="_blank"
                  className="d-block mt-3 btn btn-lg btn-primary"
                >
                  <span className="d-flex align-items-center justify-content-center">
                    <Facebook className="mr-1" />
                    <span>Donate!</span>
                  </span>
                </a>
                <p className="text-muted mt-1">
                  <small>
                    Clicking this button will bring you over to Facebook to
                    donate.
                  </small>
                  <small className="d-block">
                    Last Updated{" "}
                    {format(
                      new Date(fontPage.dontations.lastUpdated),
                      "M/d/Y h:mm aaaa"
                    )}
                  </small>
                </p>
              </div>
              <div className="col-md-6 justify-content-center text-center">
                <h1>{fontPage.metrics.totalMiles.toFixed(2)}</h1>
                <p className="text-muted">Total Miles (300mi Goal)</p>
                <ProgressBarComponent
                  total={300}
                  current={fontPage.metrics.totalMiles}
                  size={"50px"}
                />
                <a
                  href="https://members.onepeloton.com/members/gregavola/overview"
                  className="d-block mt-3 btn btn-lg btn-danger"
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <img
                      src="/pelo-icon.png"
                      height="30"
                      width="30"
                      className="mr-1"
                    />
                    <span>Follow Me On Peloton</span>
                  </div>
                </a>
                <p className="text-muted mt-2">
                  <small className="d-block mt-1">
                    Last Updated{" "}
                    {format(
                      new Date(fontPage.metrics.lastUpdated),
                      "M/d/Y h:mm aaaa"
                    )}
                  </small>
                </p>
              </div>
            </div>
            <hr />
            <div className="col-md-12 mx-auto">
              <h5 className="text-uppercase font-weight-bold mb-3">
                Mile Tracking
              </h5>
              <div style={{ height: 300, width: "100%" }}>
                <ResponsiveContainer>
                  <LineChart width={750} height={200} data={fontPage.fullDates}>
                    <XAxis dataKey="dateFormat" />

                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip itemStyle={{ color: "#00" }} />
                    <Legend />
                    <Line
                      name="Current"
                      type="monotone"
                      dataKey="actual"
                      stroke="#28a745"
                    />
                    <Line
                      name="Average"
                      type="monotone"
                      dataKey="count"
                      stroke="#007bff"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="row justify-content-center mt-3">
                <div className="col-md-3 text-center">
                  <div className="mb-2">
                    <h5>Percent of Goal</h5>
                    <div className="workout d-flex align-items-center justify-content-center">
                      <h3
                        style={{
                          fontSize: "1.75rem",
                          marginBottom: 0,
                          fontWeight: "bold",
                        }}
                        className={
                          fontPage.tracking.percentageToTrack > 100
                            ? "text-success"
                            : "text-warning"
                        }
                      >
                        {fontPage.tracking.percentageToTrack}%
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div>
                    <h5>Days Left</h5>
                    <div className="workout d-flex align-items-center justify-content-center">
                      <h3>{fontPage.tracking.daysLeft}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="mb-2">
                    <h5>Avg Miles Per Day</h5>
                    <div className="workout d-flex align-items-center justify-content-center">
                      <h3>{fontPage.tracking.averagePerDay}</h3>
                      <span className="text-muted ml-1">mi</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="mb-2">
                    <h5>Expected Total</h5>
                    <div className="workout d-flex align-items-center justify-content-center">
                      <h3>{fontPage.tracking.expectedTotal}</h3>
                      <span className="text-muted ml-1">mi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            {mostRecentWorkouts && (
              <>
                <div className="col-md-12 mx-auto">
                  <h5 className="text-uppercase font-weight-bold mb-3">
                    Most Recent Ride
                  </h5>
                  {mostRecentWorkouts.map((mostRecentWorkout: Workout) => {
                    return (
                      <div key={`recent-${mostRecentWorkout.workoutId}`}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex">
                            <div className="image">
                              <img
                                src={mostRecentWorkout.instructor.imageUrl}
                                className="rounded-circle"
                                height="50"
                                width="50"
                              />
                            </div>
                            <div className="info ml-lg-3">
                              <div style={{ fontSize: 16, fontWeight: "bold" }}>
                                {mostRecentWorkout.className}
                              </div>
                              <div
                                className="text-uppercase"
                                style={{
                                  letterSpacing: 1,
                                  fontSize: 13,
                                }}
                              >
                                {mostRecentWorkout.instructor.name}
                              </div>
                              <div
                                className="text-muted"
                                style={{
                                  letterSpacing: 1,
                                  fontSize: 12,
                                  marginTop: 0,
                                  marginBottom: 0,
                                }}
                              >
                                {mostRecentWorkout.endTime && (
                                  <>
                                    <div>
                                      {format(
                                        new Date(mostRecentWorkout.endTime),
                                        "E, LLL do @ h:mm aaaa"
                                      )}
                                    </div>
                                    <div
                                      style={{ fontSize: 13 }}
                                      className="mt-2 badge badge-success"
                                    >
                                      COMPLETE
                                    </div>
                                  </>
                                )}

                                {!mostRecentWorkout.endTime && (
                                  <>
                                    <div>
                                      Started At:
                                      {format(
                                        new Date(mostRecentWorkout.startTime),
                                        "E, LLL do @ h:mm aaaa"
                                      )}
                                    </div>
                                    <div
                                      style={{ fontSize: 13 }}
                                      className="mt-2 badge badge-danger"
                                    >
                                      LIVE
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="workout d-flex align-items-center justify-content-center">
                              <h3>{mostRecentWorkout.workOutput}</h3>
                              <span className="text-muted ml-1">kj</span>
                            </div>
                            <div className="workout d-flex align-items-center justify-content-center">
                              <h3>{mostRecentWorkout.totalMiles}</h3>
                              <span className="text-muted ml-1">mi</span>
                            </div>
                            <div className="w-100 mx-auto">
                              <a
                                className="btn btn-danger btn-sm text-uppercase"
                                target="_blank"
                                href={`https://members.onepeloton.com/members/971407f7eb744e6da652d17b34e00137/workouts/${mostRecentWorkout.workoutId}`}
                              >
                                <div className="d-flex align-items-center">
                                  <img
                                    src="/pelo-icon.png"
                                    height="20"
                                    width="20 c"
                                    className="mr-1"
                                  />
                                  Details
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div id="calendar" />
            <div className="pb-5">
              <CalendarComponent
                events={fontPage.workouts}
                onClick={(data: Workout[]) => {
                  setSelectedWorkout(data);
                  setIsModalOpen(true);
                }}
              />
            </div>
          </>
        )}
        {!fontPage && (
          <div
            className="d-flex justify-content-center spinner-border"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
      <div className="footer">
        <p className="text-muted text-center">
          Made with <Heart color="red" fill="red" /> by{" "}
          <a href="https://twitter.com/gregavola">Greg Avola</a> | ©{" "}
          {new Date().getFullYear()}
        </p>
        <p className="text-muted text-center mt-3">
          <small>Not Affilated with Peloton Interactive</small>
        </p>
      </div>
    </Layout>
  );
}
