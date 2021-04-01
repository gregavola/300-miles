import Head from "next/head";
import React, { useEffect, useState } from "react";
import CalendarComponent from "../components/Calendar";
import ProgressBarComponent from "../components/ProgressBar";
import { Modal } from "react-bootstrap";
import { Facebook, Activity, Info, Bold, Heart } from "react-feather";
import { FrontPage, Workout } from "../utils/types";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    setFrontPage(frontPageData);
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
                <>
                  <div
                    className="d-flex align-items-center justify-content-between"
                    key={item.workoutId}
                  >
                    <div className="d-flex">
                      <div className="image">
                        <img
                          src={item.instructor.imageUrl}
                          className="rounded-circle"
                          height="50"
                          width="50"
                        />
                      </div>
                      <div className="info ml-3">
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
                        <p
                          className="text-muted"
                          style={{
                            letterSpacing: 1,
                            fontSize: 12,
                            marginTop: 0,
                            marginBottom: 0,
                          }}
                        >
                          {format(
                            new Date(item.endTime),
                            "EEEE LLL do @ h:mm aaaa"
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="workout d-flex align-items-center justify-content-center">
                        <h3>{item.workOutput}</h3>
                        <span className="text-muted ml-1">kj</span>
                      </div>
                      <a
                        className="btn btn-danger btn-sm text-uppercase"
                        target="_blank"
                        href={`https://members.onepeloton.com/members/971407f7eb744e6da652d17b34e00137/workouts/${item.workoutId}`}
                      >
                        View on Peloton
                      </a>
                    </div>
                  </div>
                  <hr />
                </>
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
                Racing for a Cure
              </div>
              <h2>
                Join me as I race to 300 miles for the month of April on the
                Peloton, to raise donations for the American Cancel Sociey.
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
                  In April, I am hoping to raise $500 to support the American
                  Cancer Society by riding 300 miles on my Peloton, and I am
                  asking for your support.
                </strong>{" "}
                I know that it's hard time for everyone with the current
                pandemic, but every little bit helps from $1 to $500. You can
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
                <p className="text-muted">Amount Raised ($500 Goal)</p>
                <ProgressBarComponent
                  total={500}
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
                <h1>{fontPage.metrics.totalMiles}</h1>
                <p className="text-muted">Total Miles (300mi Goal)</p>
                <ProgressBarComponent
                  total={400}
                  current={fontPage.metrics.totalMiles}
                  size={"50px"}
                />
                <a
                  href="https://members.onepeloton.com/members/gregavola/overview"
                  className="d-block mt-3 btn btn-lg btn-danger"
                >
                  Follow Me On Peloton
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
            <div id="calendar" />
            <CalendarComponent
              events={fontPage.workouts}
              onClick={(data: Workout[]) => {
                setSelectedWorkout(data);
                setIsModalOpen(true);
              }}
            />
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
      </div>
    </Layout>
  );
}
