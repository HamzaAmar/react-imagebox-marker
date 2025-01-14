import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const ImageMapper = ({
  bufferPoisition = 5,
  scrollable = true,
  wrapperBorder = "none",
  lasbelStyles = {},
  imageSource,
  dataSource,
  x_AxisAttribute,
  y_AxisAttribute,
  idAttribute,
  labelAttribute,
  getMark,
  status
}) => {
  const [marksList, setMarksList] = useState([]);
  const [imgCoordinates, setImgCoordinates] = useState(null);
  const imgElem = useRef(null);

  useEffect(() => {
    setMarksList(dataSource);
  }, [dataSource]);

  const loadImg = () => {
    if (imgElem) {
      setImgCoordinates({
        height: imgElem.current.clientHeight,
        width: imgElem.current.clientWidth
      });
    }
  };

  const addMark = (e) => {
    if (status === "locked") return;
    const offset = imgElem.current.getBoundingClientRect();
    const x = e.pageX - offset.left - window.pageXOffset;
    const y = e.pageY - offset.top - window.pageYOffset;
    // console.log(x, y);
    const updatedList = [...marksList];
    if (status === "edit") {
      updatedList.pop();
    }
    const nextId =
      (updatedList.length === 0
        ? 0
        : +updatedList[updatedList.length - 1][idAttribute]) + 1;
    const newMark = {
      [idAttribute]: nextId,
      [labelAttribute]: nextId,
      [x_AxisAttribute]: x - bufferPoisition,
      [y_AxisAttribute]: y - bufferPoisition
    };
    updatedList.push(newMark);
    setMarksList(updatedList);
    getMark(newMark);
  };

  const GetStableMark = (data) => {
    const isEquals = marksList.length === dataSource.length;
    if (isEquals) getMark(data, true);
  };

  return (
    <div
      style={
        !!scrollable
          ? { userSelect: "none", boxSizing: "border-box", overflow: "auto" }
          : { userSelect: "none" }
      }
    >
      <div
        style={{
          height: `${imgCoordinates ? imgCoordinates.height : 0}px`,
          width: `${imgCoordinates ? imgCoordinates.width : 0}px`,
          position: "relative",
          userSelect: "none",
          boxSizing: "initial",
          border: wrapperBorder
        }}
      >
        <img
          className="img-main"
          src={imageSource}
          alt="#"
          onMouseDown={(e) => addMark(e)}
          ref={imgElem}
          onLoad={loadImg}
          style={{ userSelect: "none" }}
        />
        {marksList.map((data) => (
          <div
            key={data[idAttribute]}
            style={{
              position: "absolute",
              color: "#fff",
              backgroundColor: "#000",
              borderRadius: "50px",
              padding: "3px",
              cursor: "default",
              ...lasbelStyles,
              userSelect: "none",
              left: data[x_AxisAttribute],
              top: data[y_AxisAttribute]
            }}
            onClick={() => GetStableMark(data)}
          >
            {data[labelAttribute]}
          </div>
        ))}
      </div>
    </div>
  );
};

ImageMapper.propTypes = {
  x_AxisAttribute: PropTypes.string.isRequired,
  y_AxisAttribute: PropTypes.string.isRequired,
  idAttribute: PropTypes.string.isRequired,
  labelAttribute: PropTypes.string.isRequired,
  scrollable: PropTypes.bool.isRequired,
  imageSource: PropTypes.string.isRequired,
  dataSource: PropTypes.array.isRequired,
  status: PropTypes.oneOf(["new", "edit", "locked"]).isRequired,
  getMark: PropTypes.func.isRequired,
  bufferPoisition: PropTypes.number,
  wrapperBorder: PropTypes.string,
  lasbelStyles: PropTypes.object
};

export default ImageMapper;
