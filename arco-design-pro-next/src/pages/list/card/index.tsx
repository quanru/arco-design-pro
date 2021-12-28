import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Tabs,
  Breadcrumb,
  Card,
  Input,
  Spin,
  Typography,
  Grid,
} from '@arco-design/web-react';
import useLocale from '@/utils/useLocale';
import locale from './locale';
import styles from './style/index.module.less';
import CardBlock from './card-block';
import AddCard from './card-add';
import { QualityInspection, BasicCard } from './interface';
import './mock';

const { Title } = Typography;
const { Row, Col } = Grid;
export default function ListCard() {
  const t = useLocale(locale);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    quality: [],
    service: [],
    rules: [],
  });

  const [activeKey, setActiveKey] = useState('all');

  const getData = () => {
    setLoading(true);
    axios
      .get('/api/cardList')
      .then((res) => {
        setData(res.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getData();
  }, []);
  7;
  const getCardList = (
    list: Array<BasicCard & QualityInspection>,
    type: keyof typeof data
  ) => {
    return (
      <Spin loading={loading} style={{ width: '100%' }}>
        <Row gutter={24} className={styles.cardContent}>
          {type === 'quality' && (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <AddCard description={t['cardList.add.quality']} />
            </Col>
          )}
          {list.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={6} key={index}>
              <CardBlock card={item} type={type} />
            </Col>
          ))}
        </Row>
      </Spin>
    );
  };

  return (
    <div className={styles.container}>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>{t['menu.list']}</Breadcrumb.Item>
        <Breadcrumb.Item>{t['menu.list.card']}</Breadcrumb.Item>
      </Breadcrumb>
      <Card>
        <Tabs
          activeTab={activeKey}
          type="rounded"
          onChange={setActiveKey}
          extra={
            <Input.Search
              style={{ width: '240px' }}
              placeholder={t[`cardList.tab.${activeKey}.placeholder`]}
            />
          }
        >
          <Tabs.TabPane key="all" title={t['cardList.tab.title.all']} />
          <Tabs.TabPane key="quality" title={t['cardList.tab.title.quality']} />
          <Tabs.TabPane key="service" title={t['cardList.tab.title.service']} />
          <Tabs.TabPane key="rules" title={t['cardList.tab.title.rules']} />
        </Tabs>

        {activeKey === 'all' ? (
          Object.entries(data).map(([key, list]) => (
            <div key={key}>
              <Title heading={6}>{t[`cardList.tab.title.${key}`]}</Title>
              {getCardList(list, key as keyof typeof data)}
            </div>
          ))
        ) : (
          <div className={styles.singleContent}>
            {getCardList(data[activeKey], activeKey as keyof typeof data)}
          </div>
        )}
      </Card>
    </div>
  );
}