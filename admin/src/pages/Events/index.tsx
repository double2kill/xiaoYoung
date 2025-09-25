import { deleteEvent, getEventsList, type EventItem } from '@/services/events';
import { DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Descriptions,
  message,
  Modal,
  Popconfirm,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

const Events: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);

  const handleArchive = async (id: string) => {
    try {
      await deleteEvent(id);
      message.success('归档成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('归档失败');
    }
  };

  const showDetail = (record: EventItem) => {
    setCurrentEvent(record);
    setDetailModalVisible(true);
  };

  const handleCreateEvent = async (values: any) => {
    try {
      // 处理数据格式
      const eventData = {
        ...values,
        maxParticipants: Number(values.maxParticipants),
        createdBy: '507f1f77bcf86cd799439011', // 临时使用一个有效的ObjectId
        tags: values.tags
          ? values.tags.split(',').map((tag: string) => tag.trim())
          : [],
      };

      const response = await createEvent(eventData);
      if (response.code === 200) {
        message.success('创建活动成功');
        setCreateModalVisible(false);
        createForm.resetFields();
        actionRef.current?.reload();
      } else {
        message.error(response.message || '创建活动失败');
      }
    } catch (error) {
      console.error('创建活动失败:', error);
      message.error(error.message || '创建活动失败');
    }
  };

  const loadGroups = async () => {
    setGroupsLoading(true);
    try {
      const response = await getGroupsList();
      setGroups(response.data);
    } catch (error) {
      message.error('获取群组列表失败');
    } finally {
      setGroupsLoading(false);
    }
  };

  const showCreateModal = () => {
    setCreateModalVisible(true);
    loadGroups();
  };

  const columns: ProColumns<EventItem>[] = [
    {
      title: '活动标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '所属圈子',
      dataIndex: ['groupId', 'name'],
      key: 'groupName',
      width: 150,
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
      render: (_, record) => dayjs(record.startTime).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 180,
      render: (_, record) => dayjs(record.endTime).format('YYYY-MM-DD HH:mm'),
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
      title: '创建者',
      dataIndex: ['createdBy', 'name'],
      key: 'createdBy',
      width: 100,
      render: (_, record) => record.createdBy?.name || '未知',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space wrap>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            size="small"
          >
            详情
          </Button>
          <Popconfirm
            title="确定要归档这个活动吗？"
            description="归档后活动将不再显示在列表中，但数据仍会保留"
            onConfirm={() => handleArchive(record._id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              归档
            </Button>
          </Popconfirm>
        </Space>
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

      <Modal
        title="活动详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentEvent && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="活动标题" span={2}>
              {currentEvent.title}
            </Descriptions.Item>
            <Descriptions.Item label="活动描述" span={2}>
              {currentEvent.description}
            </Descriptions.Item>
            <Descriptions.Item label="活动地点">
              {currentEvent.location}
            </Descriptions.Item>
            <Descriptions.Item label="所属圈子">
              {currentEvent.groupId.name}
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">
              {dayjs(currentEvent.startTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {dayjs(currentEvent.endTime).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="报名截止">
              {dayjs(currentEvent.deadline).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="最大参与人数">
              {currentEvent.maxParticipants}
            </Descriptions.Item>
            <Descriptions.Item label="当前参与人数">
              {currentEvent.participants.length}
            </Descriptions.Item>
            <Descriptions.Item label="活动状态">
              <Tag
                color={
                  currentEvent.status === 'approved'
                    ? 'green'
                    : currentEvent.status === 'rejected'
                    ? 'red'
                    : 'orange'
                }
              >
                {currentEvent.status === 'approved'
                  ? '已通过'
                  : currentEvent.status === 'rejected'
                  ? '已拒绝'
                  : '待审核'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="创建者">
              {currentEvent.createdBy?.name || '未知'}
            </Descriptions.Item>
            {currentEvent.requirements && (
              <Descriptions.Item label="参与要求" span={2}>
                {currentEvent.requirements}
              </Descriptions.Item>
            )}
            {currentEvent.safetyNotice && (
              <Descriptions.Item label="安全提醒" span={2}>
                {currentEvent.safetyNotice}
              </Descriptions.Item>
            )}
            {currentEvent.feeInfo && (
              <Descriptions.Item label="费用信息" span={2}>
                {currentEvent.feeInfo}
              </Descriptions.Item>
            )}
            {currentEvent.tags && currentEvent.tags.length > 0 && (
              <Descriptions.Item label="标签" span={2}>
                {currentEvent.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="参与者" span={2}>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {currentEvent.participants.map((participant, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    <Space>
                      <UserOutlined />
                      <span>{participant.userId.name}</span>
                      <Tag
                        color={
                          participant.status === 'approved'
                            ? 'green'
                            : participant.status === 'rejected'
                            ? 'red'
                            : 'orange'
                        }
                      >
                        {participant.status === 'approved'
                          ? '已通过'
                          : participant.status === 'rejected'
                          ? '已拒绝'
                          : '待审核'}
                      </Tag>
                    </Space>
                  </div>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Events;
