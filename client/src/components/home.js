import React, { useState, useEffect, useContext } from "react";
import { usercontext } from "../App";
import { Link } from "react-router-dom";
import { serverurl } from "../config";
import ReactLoading from "react-loading";
import { UncontrolledCarousel } from "reactstrap";
import "../stylesheet/home.css";



const Home = () => {
  const [data, setdata] = useState([]);
  const { state, dispatch } = useContext(usercontext);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    fetch(serverurl + "/feeds/", {
      method: "get",
      query: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((result) => {
        setdata(result);
        setloading(true);
      });
  }, []);

  const Marquee = <div>


    <div class="marquee">
      <p>Test</p>
    </div>


  </div>;
  
  return (
    
      <div className="container">
        <div className="air-force">
          <AirForce />
        </div>

        <div className="main-home">
          <h2 className="news"> NEWS </h2>
          <div>
            {data && loading ? (
              Marquee
            ) : (
              <ReactLoading
                type="bars"
                color="floralwhite"
                height={667}
                width={375}
              />
            )}
            {data.length == 0 && loading ? (
              <div>No news availaible</div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    
  );
};

const items = [
  // {
  //   src:
  //     "https://afcat.cdac.in/AFCAT/assets/images/gallery/Helicopters/helicop9.gif",
  //   key: "1",
  //   className: "air-force-item",
  // },
  {
    src:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSaH5M7D9mA1-cWxKcNyXs-Pic1zRCSkNzT_A&usqp=CAU",
    key: "1",
    className: "air-force-item",
  },
  {
    src:
      "https://www.airforce-technology.com/wp-content/uploads/sites/4/2017/09/1l-image-70.jpg",
    key: "2",
    className: "air-force-item",
  },
  {
    src:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQwNvqN-PA_csGJY6fF5JAw0k0qpxK8jhOD8w&usqp=CAU",
    key: "3",
    className: "air-force-item",
  },
  // {
  //   src:
  //     "https://afcat.cdac.in/AFCAT/assets/images/gallery/Helicopters/helicop3.gif",
  //   key: "2",
  //   className: "air-force-item",
  // },
  {
    src: "https://images.financialexpress.com/2019/10/PIC-5.jpg",
    key: "4",
    className: "air-force-item",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTqKzWIzU97FRmw5GfYuPwUTHeleRPeYQHqoA&usqp=CAU",
    key: "5",
    className: "air-force-item",
  },
 
];
const AirForce = () => <UncontrolledCarousel items={items} />;

export default Home;
