import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Layout } from "antd";
import Header from "../../Components/Header/Header";
import Content from "../../Components/Content/Content";

const Dashboard = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  return (
    <Layout>
      <Header />
      <Content />
    </Layout>
  );
};

export default Dashboard;
