import React, { useState } from "react";
import { DOMParser } from "xmldom";
import "./App.css";
import RingLoader from "react-spinners/RingLoader";
var xpath = require("xpath");

function App() {
  // States
  const [link, setLink] = useState("");
  const [l480, setL480] = useState("");
  const [l720, setL720] = useState("");
  const [l240, setL240] = useState("");
  const [lod, setlod] = useState(false);
  const [downloaded, setdownloaded] = useState(false);
  const [title, setTitle] = useState("");
  //
  const getlink = (link) => {
    if (RegExp("^alaatv.com/c/[0-9]+").test(link)) {
      link = "https://" + link;
    }
    if (RegExp("(https?|http?)?alaatv.com/c/[0-9]+").test(link)) {
      setlod(true);
      var request = new XMLHttpRequest();
      request.open("GET", link, true);
      request.send(null);

      request.onreadystatechange = function () {
        if (request.readyState === 4) {
          if (request.status === 404) {
            setdownloaded(false);
            setlod(false);

            alert("Video Not Found");
          } else {
            let doc = new DOMParser().parseFromString(request.responseText);
            setL720(
              xpath.select('//source[@res="720p"]/@src', doc)[0].nodeValue
            );
            setL480(
              xpath.select('//source[@res="480p"]/@src', doc)[0].nodeValue
            );
            setL240(
              xpath.select('//source[@res="240p"]/@src', doc)[0].nodeValue
            );
            setTitle(
              xpath.select(
                '//h1[@class="m--regular-font-size-lg3 m--font-bold m--font-focus contentTitleH1"]',
                doc
              )[0].textContent
            );
            setdownloaded(true);
            setlod(false);
          }
        }
      };
    } else {
      alert("Site Address Not Valid exmaple: https://alaatv.com/c/12345");
    }
  };

  return (
    <>
      <div
        className={`${
          lod === true ? "d-flex" : "d-none"
        } col-12  h-100 justify-content-center align-content-center align-items-center `}
        style={{
          opacity: "0.5",
          filter: "alpha(opacity=50)",
          background: "#000000",
          zIndex: "1",
          position: "absolute",
        }}
      >
        <RingLoader color={"#ffffff"} loading={lod} size={70} />
      </div>
      <div
        class="container"
        style={{
          zIndex: "0",
        }}
      >
        <h2 className="text-center textcolor mt-1">AlaaTv Downloader </h2>
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8 mt-3">
            <div
              class="card card-sm"
              style={{
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 9px 29px 0px",
                borderRadius: "10px",
              }}
            >
              <div class="card-body row no-gutters align-items-center">
                <div class="col">
                  <input
                    class="form-control form-control-lg form-control-borderless"
                    type="search"
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                    placeholder="Enter Link Video : https://alaatv.com/c/12345"
                  />
                </div>
                <div class="col-auto">
                  <button
                    style={{ borderRadius: "10px" }}
                    onClick={() => getlink(link)}
                    class="btn btn-lg btn-success"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(() => {
        if (downloaded && lod !== true) {
          return (
            <div className=" mt-5 d-flex flex-column col-12 justify-content-center  align-items-center">
              <h4 className="text-center ">{title}</h4>
              <br />
              <div className="d-flex col-7 row justify-content-around align-items-center">
                <button
                  onClick={() => window.open(l720, "_blank")}
                  className="btn1 mt-sm-2 mt-lg-0 mt-md-0 mt-3 btn-primary col-sm-11 col-11 col-md-3 col-lg-3"
                >
                  Download 720p
                </button>
                <button
                  onClick={() => window.open(l480, "_blank")}
                  className="btn1 mt-sm-2 mt-lg-0 mt-md-0 mt-3 btn-primary col-sm-11 col-11 col-md-3 col-lg-3"
                >
                  Download 480p
                </button>
                <button
                  onClick={() => window.open(l240, "_blank")}
                  className="btn1 mt-sm-2 mt-lg-0 mt-md-0 mt-3 btn-primary col-sm-11 col-11 col-md-3 col-lg-3"
                >
                  Download 240p
                </button>
              </div>
            </div>
          );
        }
      })()}
    </>
  );
}

export default App;
