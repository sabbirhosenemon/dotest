import React from "react";
import { Spin } from "antd";

function Loader(props) {
  return (
    <div>
      <div className='example'>
        <h5> Loading Please Wait ...</h5>
        <Spin size='large' />
      </div>
    </div>
  );
}

export default Loader;
