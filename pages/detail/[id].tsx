import { getWorkout } from "../../utils/getWorkout";
import { GraphMetrics, Workout } from "../../utils/types";
import format from "date-fns/format";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { getTotalMiles } from "../../utils/getTotalMiles";
import ProgressBar from "@ramonak/react-progress-bar";
import Layout from "../../components/Layout";

export interface DefaultProps {
  workout: Workout;
  totalMiles: number;
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const workout = await getWorkout(id);
  const totalMiles = await getTotalMiles(workout.endTime);

  return {
    props: { workout, totalMiles },
  };
}

export default function Detail({ workout, totalMiles }: DefaultProps) {
  return (
    <Layout>
      <div
        id="workout-share"
        className="p-2 bg-dark text-light"
        style={{ width: 1200 }}
      >
        <div className="justify-content-center align-items-center pt-2 pt-3 d-flex justify-content-between">
          <div className="title-block d-flex align-items-center">
            <div className="bg-light font-weight-bold text-center mr-3 ml-3 border-white pr-3 pl-3 mr-2">
              <div
                className="mb-0 mt-1 text-uppercase text-dark"
                style={{ fontSize: 18 }}
              >
                {format(new Date(workout.endTime), "MMM")}
              </div>
              <div style={{ fontSize: 30 }} className="text-dark">
                {format(new Date(workout.endTime), "d")}
              </div>
            </div>
            <span className="mr-3">
              <img
                src={workout.instructor.imageUrl}
                className="rounded-circle"
                height="75"
                width="75"
              />
            </span>
            <div>
              <h3 className="mb-0 font-weight-bold">{workout.className}</h3>
              <div>{workout.instructor.name}</div>
              <p className="text-muted mb-0">
                {format(new Date(workout.endTime), "M/d/y h:mm a")}
              </p>
            </div>
          </div>
          <div className="image">
            <img src="/peloton-logo.png" style={{ width: "200px" }} />
          </div>
        </div>
        <div className="container mb-4 mt-4">
          <h3 className="mb-0">
            Progress <small>({totalMiles.toFixed(2)}m / 400m)</small>
          </h3>

          <div className="mt-3">
            <ProgressBar
              bgColor={"#fff"}
              baseBgColor={"#808080"}
              labelAlignment={"outside"}
              borderRadius={"5px"}
              labelColor={"#fff"}
              completed={parseFloat(((totalMiles / 400) * 100).toFixed(2))}
            />
          </div>
        </div>
        <hr style={{ borderTop: "1px solid #808080" }} />
        <div className="row pl-5 pr-5 pt-3 align-items-center">
          <div className="col-md-3">
            {Object.keys(workout.workoutMetrics).map((key) => {
              return (
                <div className="mb-5" key={`${key}-summary-metric`}>
                  <div className="d-flex align-items-baseline">
                    <h1 className="font-weight-bold">
                      {workout.workoutMetrics[key].value}
                    </h1>
                    <div style={{ fontSize: 25 }}>
                      {workout.workoutMetrics[key].display_unit}
                    </div>
                  </div>
                  <h4>{workout.workoutMetrics[key].display_name}</h4>
                </div>
              );
            })}
            <hr className="mb-5" style={{ borderTop: "1px solid #808080" }} />
            {workout.metrics.map((item: GraphMetrics, num: number) => {
              return (
                <div className="mb-5" key={`${num}-graphmetric-detail`}>
                  <div className="d-flex align-items-baseline">
                    <h1 className="font-weight-bold">{item.average_value}</h1>
                    <div style={{ fontSize: 25 }}>{item.display_unit}</div>
                  </div>
                  <h4>Avg {item.display_name}</h4>
                </div>
              );
            })}
          </div>
          <div className="col-md-9">
            {workout.metrics.map((item: GraphMetrics, num: number) => {
              const rangeTicket = item.values.length / 4500;
              const setValues = item.values.map((tick, num) => {
                return { v: tick, x: rangeTicket * num };
              });

              return (
                <div key={`${num}-graph-metric`}>
                  <div className="d-flex justify-content-between">
                    <h5>{item.display_name}</h5>
                    <div className="info d-flex">
                      <span className="mr-3">
                        {" "}
                        Max: {item.max_value}
                        {item.display_unit}
                      </span>
                      <span>
                        {" "}
                        Avg: {item.average_value}
                        {item.display_unit}
                      </span>
                    </div>
                  </div>

                  <LineChart width={750} height={200} data={setValues}>
                    <XAxis height={60} tick={false} dataKey="x" />
                    <YAxis />
                    <Tooltip itemStyle={{ color: "#000" }} />
                    <Line
                      dot={false}
                      type="monotone"
                      dataKey="v"
                      stroke="#fff"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </div>
              );
            })}
          </div>
        </div>
        <hr style={{ borderTop: "1px solid #808080" }} />
        <div>
          <p className="text-muted mb-0 text-right pt-0 pb-3 pr-3">
            @gregavola
          </p>
        </div>
      </div>
    </Layout>
  );
}
