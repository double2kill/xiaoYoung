import { getEventDetail, type EventItem } from '@/services/events';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { history, useParams } from '@umijs/max';
import { Button, message, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [eventInfo, setEventInfo] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const fetchEventDetail = async () => {
    setLoading(true);
    try {
      const result = await getEventDetail(id!);
      if (result.code === 200) {
        setEventInfo(result.data);
      } else {
        message.error('获取活动详情失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' },
    };
    const config = statusMap[status as keyof typeof statusMap] || {
      color: 'default',
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const renderParticipantStatus = (status: string) => {
    const statusMap = {
      pending: { color: 'orange', text: '待审核' },
      approved: { color: 'green', text: '已通过' },
      rejected: { color: 'red', text: '已拒绝' },
    };
    const config = statusMap[status as keyof typeof statusMap] || {
      color: 'default',
      text: status,
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <PageContainer
      loading={loading}
      header={{
        title: eventInfo?.title || '活动详情',
        onBack: () => history.back(),
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
          >
            返回列表
          </Button>,
        ],
      }}
    >
      <ProCard title="基本信息" style={{ marginBottom: 16 }}>
        <ProDescriptions
          column={2}
          dataSource={eventInfo}
          columns={[
            {
              title: '活动标题',
              dataIndex: 'title',
              span: 2,
            },
            {
              title: '活动描述',
              dataIndex: 'description',
              span: 2,
            },
            {
              title: '所属圈子',
              dataIndex: ['groupId', 'name'],
              render: (_, record) =>
                record.groupId ? (
                  <a
                    onClick={() =>
                      history.push(`/groups/${record.groupId._id}`)
                    }
                  >
                    {record.groupId.name}
                  </a>
                ) : (
                  '-'
                ),
            },
            {
              title: '活动地点',
              dataIndex: 'location',
            },
            {
              title: '开始时间',
              dataIndex: 'startTime',
              render: (text) =>
                dayjs(text as string).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '结束时间',
              dataIndex: 'endTime',
              render: (text) =>
                dayjs(text as string).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '报名截止',
              dataIndex: 'deadline',
              render: (text) =>
                dayjs(text as string).format('YYYY-MM-DD HH:mm:ss'),
            },
            {
              title: '活动状态',
              dataIndex: 'status',
              render: (text) => renderStatus(text as string),
            },
            {
              title: '最大参与人数',
              dataIndex: 'maxParticipants',
            },
            {
              title: '当前参与人数',
              dataIndex: 'participants',
              render: (participants: EventItem['participants']) =>
                Array.isArray(participants) ? participants.length : 0,
            },
            {
              title: '创建者',
              dataIndex: ['createdBy', 'name'],
              render: (_, record) => record.createdBy?.name || '未知',
            },
            {
              title: '创建时间',
              dataIndex: 'createdAt',
              render: (text) =>
                text
                  ? dayjs(text as string).format('YYYY-MM-DD HH:mm:ss')
                  : '-',
            },
            {
              title: '参与要求',
              dataIndex: 'requirements',
              span: 2,
              render: (text) => text || '-',
            },
            {
              title: '安全提醒',
              dataIndex: 'safetyNotice',
              span: 2,
              render: (text) => text || '-',
            },
            {
              title: '费用信息',
              dataIndex: 'feeInfo',
              span: 2,
              render: (text) => text || '-',
            },
            {
              title: '标签',
              dataIndex: 'tags',
              span: 2,
              render: (tags: string[]) =>
                Array.isArray(tags) && tags.length > 0
                  ? tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
                  : '-',
            },
          ]}
        />
      </ProCard>

      <ProCard title="参与者列表">
        <ProTable
          dataSource={eventInfo?.participants || []}
          rowKey={(record) => record.userId._id}
          search={false}
          pagination={{
            pageSize: 10,
          }}
          columns={[
            {
              title: '用户信息',
              dataIndex: 'userId',
              render: (userId: any) => (
                <div>
                  <div>
                    <Space>
                      <UserOutlined />
                      <strong>{userId?.name || '未知用户'}</strong>
                    </Space>
                  </div>
                  {userId?.email && (
                    <div style={{ color: '#666', fontSize: '12px' }}>
                      邮箱: {userId.email}
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (status: string) => renderParticipantStatus(status),
            },
            {
              title: '报名时间',
              dataIndex: 'signUpAt',
              render: (text: string) =>
                text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
            },
            {
              title: '备注',
              dataIndex: 'note',
              render: (text: string) => text || '-',
            },
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};

export default EventDetail;
