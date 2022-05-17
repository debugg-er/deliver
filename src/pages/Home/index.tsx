import React from "react";

import "./Home.css";

Error.stackTraceLimit = 999;

function Home() {
  return (
    <div className="Home">
      <div className="Home__Title">Chào mừng đến với Deliver</div>
      <div className="Home__Description">
        Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu
        hoá cho máy tính của bạn.
      </div>

      <img className="Home__Img" src="/welcome.jpg" alt="" />

      <div className="Home__Title2">Trải nghiệm xuyên suốt</div>

      <div className="Home__Description">
        Kết nối và giải quyết công việc trên mọi thiết bị với dữ liệu luôn được đồng bộ
      </div>
    </div>
  );
}

export default Home;
