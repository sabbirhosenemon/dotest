import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";

import { Button, Col, Row } from "antd";

import { LogoutOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const toggler = [
  <svg
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    key={0}
  >
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>,
];

function Header({ onPress, collapsed, handleCollapsed }) {
  useEffect(() => window.scrollTo(0, 0));

  const isLogged = localStorage.getItem("isLogged");

  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={4}>
          <div className={styles.sidebarTogglerPC}>
            {isLogged &&
              React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: `${styles.trigger}`,
                  onClick: () => handleCollapsed(!collapsed),
                }
              )}
          </div>
        </Col>
        <Col span={24} md={20} className={styles.headerControl}>
          {isLogged ? (
            <Link to="/auth/logout" className={styles.logoutLink}>
              <LogoutOutlined className="text-danger" />
              <span className="text-dark font-weight-bold">Log Out</span>
            </Link>
          ) : (
            <Link to="/auth/login" className="btn-sign-in text-dark">
              <span></span>
            </Link>
          )}
          {isLogged && (
            <Button
              type="link"
              className={styles.sidebarTogglerMobile}
              onClick={() => onPress()}
              style={{boxShadow: "none"}}
            >
              {toggler}
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Header;
