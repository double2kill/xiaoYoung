import { deleteEvent, getEventsList, type EventItem } from '@/services/events';
import { DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message, Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useRef } from 'react';

const Events: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const handleArchive = async (id: string) => {
    try {
      await deleteEvent(id);
      message.success('归档成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('归档失败');
    }
  };

  const columns: ProColumns<EventItem>[] = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <a onClick={() => history.push(`/events/${record._id}`)}>
          {record.title}
        </a>
      ),
    },
    {
      title: '所属圈子',
      dataIndex: ['groupId', 'name'],
      key: 'groupName',
      width: 150,
      render: (_, record) =>
        record.groupId ? (
          <a onClick={() => history.push(`/groups/${record.groupId._id}`)}>
            {record.groupId.name}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: '活动地点',
      dataIndex: 'location',
      key: 'location',
      width: 150,
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (_, record) =>
        dayjs(record.startTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '参与人数',
      key: 'participantCount',
      width: 120,
      render: (_, record) => (
        <span>
          {record.participants.length}/{record.maxParticipants}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const status = statusMap[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="确定要归档这个活动吗？"
          description="归档后活动将不再显示在列表中，但数据仍会保留"
          onConfirm={() => handleArchive(record._id)}
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            归档
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<EventItem>
        headerTitle="活动列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1200 }}
        request={async (params) => {
          const response = await getEventsList({
            groupId: params.groupId,
            status: params.status,
          });
          return {
            data: response.data,
            success: true,
            total: response.data.length,
          };
        }}
        columns={columns}
        toolBarRender={() => []}
      />
    </PageContainer>
  );
};

export default Events;
