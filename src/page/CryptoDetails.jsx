import { useState } from "react";
import HTMLReactParser from "html-react-parser";
import { useParams } from "react-router-dom";
import millify from "millify";
import { Col, Row, Typography, Select } from "antd";
import {
  MoneyCollectOutlined,
  DollarCircleOutlined,
  FundOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  CheckOutlined,
  NumberOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import LineChart from "../components/LineChart";
import Loader from "../components/Loader";
import ButtonTrack from "../components/ButtonTrack";
import {
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
} from "../services/cryptoApi";
import "../styles/cryptoDetails.css";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CryptoDetails() {
  const [timePeriod, setTimePeriod] = useState("7d");
  const { coinId } = useParams();
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({
    coinId,
    timePeriod,
  });
  const cryptoDetails = data?.data?.coin;
  if (isFetching) return <Loader />;

  const {
    uuid,
    rank,
    name,
    iconUrl,
    price,
    marketCap,
    allTimeHigh,
    change,
    description,
    links,
    numberOfMarkets,
    numberOfExchanges,
    approvedSupply,
    supply,
  } = cryptoDetails;

  const time = ["7d", "30d"];

  const stats = [
    {
      title: "Price to USD",
      value: `$ ${price && millify(price)}`,
      icon: <DollarCircleOutlined />,
    },
    { title: "Rank", value: rank, icon: <NumberOutlined /> },
    {
      title: "24h Volume",
      value: `$ ${
        cryptoDetails["24hVolume"] ? millify(cryptoDetails["24hVolume"]) : "-"
      }`,
      icon: <ThunderboltOutlined />,
    },
    {
      title: "Market Cap",
      value: `$ ${marketCap && millify(marketCap)}`,
      icon: <DollarCircleOutlined />,
    },
    {
      title: "All-time-high(daily avg.)",
      value: `$ ${millify(allTimeHigh.price)}`,
      icon: <TrophyOutlined />,
    },
  ];

  const genericStats = [
    {
      title: "Number Of Markets",
      value: numberOfMarkets,
      icon: <FundOutlined />,
    },
    {
      title: "Number Of Exchanges",
      value: numberOfExchanges,
      icon: <MoneyCollectOutlined />,
    },
    {
      title: "Aprroved Supply",
      value: approvedSupply ? <CheckOutlined /> : <StopOutlined />,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Total Supply",
      value: `$ ${millify(supply.total)}`,
      icon: <ExclamationCircleOutlined />,
    },
    {
      title: "Circulating Supply",
      value: `$ ${millify(supply.circulating)}`,
      icon: <ExclamationCircleOutlined />,
    },
  ];

  return (
    <Col className="coin-detail-container">
      <Col className="coin-heading-container">
        <Title level={2} className="coin-name">
          {name} Price
        </Title>
        <p>
          {name} live price in US Dollar (USD). View value statistics, market
          cap and supply.
        </p>
        <ButtonTrack
          uuid={uuid}
          name={name}
          rank={rank}
          price={millify(price)}
          marketCap={millify(marketCap)}
          change={change}
        />
      </Col>
      <Select
        defaultValue="7d"
        className="select-timeperiod"
        placeholder="Select Timeperiod"
        onChange={(value) => setTimePeriod(value)}
      >
        {time.map((date) => (
          <Option key={date}>{date}</Option>
        ))}
      </Select>
      <LineChart
        coinHistory={coinHistory}
        currentPrice={millify(price)}
        coinName={name}
      />
      <Col className="stats-container">
        <Col className="coin-value-statistics">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">
              {name} Value Statistics
            </Title>
            <p>
              An overview showing the statistics of {name}, such as the base and
              quote currency, the rank, and trading volume.
            </p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats" key={title}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info">
          <Col className="coin-value-statistics-heading">
            <Title level={3} className="coin-details-heading">
              Other Stats Info
            </Title>
            <p>
              An overview showing the statistics of {name}, such as the base and
              quote currency, the rank, and trading volume.
            </p>
          </Col>
          {genericStats.map(({ icon, title, value }, index) => (
            <Col className="coin-stats" key={index}>
              <Col className="coin-stats-name">
                <Text>{icon}</Text>
                <Text>{title}</Text>
              </Col>
              <Text className="stats">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link">
        <Row className="coin-desc">
          <Title level={3} className="coin-details-heading">
            What is {name}?
          </Title>
          {HTMLReactParser(description)}
        </Row>
        <Col className="coin-links">
          <Title level={3} className="coin-details-heading">
            {name} Links
          </Title>
          {links?.map((link) => (
            <Row className="coin-link" key={link.name}>
              <Title level={5} className="link-name">
                {link.type}
              </Title>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.name}
              </a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
}
