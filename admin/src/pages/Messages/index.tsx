import {
  deleteMessage,
  getMessagesList,
  markAsRead,
  type MessageItem,
} from '@/services/messages';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
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

const Messages: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<MessageItem | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleMarkAsRead = async (id: string, userId: string) => {
    try {
      await markAsRead(id, { userId });
      message.success('标记为已读成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('标记失败');
    }
  };

  const showDetail = (record: MessageItem) => {
    setCurrentMessage(record);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<MessageItem>[] = [
    {
      title: '发送者',
      dataIndex: ['senderId', 'name'],
      key: 'senderName',
      width: 120,
    },
    {
      title: '接收者',
      dataIndex: ['receiverId', 'name'],
      key: 'receiverName',
      width: 120,
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300 }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          text: { color: 'blue', text: '文本' },
          image: { color: 'green', text: '图片' },
          file: { color: 'orange', text: '文件' },
        };
        const config = typeMap[type as keyof typeof typeMap] || {
          color: 'default',
          text: type,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '附件数量',
      dataIndex: 'attachments',
      key: 'attachmentCount',
      width: 100,
      render: (attachments: string[]) => attachments?.length || 0,
    },
    {
      title: '已读状态',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 100,
      render: (isRead: boolean, record: MessageItem) => (
        <Space>
          <Tag color={isRead ? 'green' : 'red'}>{isRead ? '已读' : '未读'}</Tag>
          {!isRead && (
            <Button
              type="link"
              size="small"
              onClick={() =>
                handleMarkAsRead(record._id, record.receiverId._id)
              }
            >
              标记已读
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
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
            title="确定要删除这条消息吗？"
            description="删除后无法恢复"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<MessageItem>
        headerTitle="消息列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1200 }}
        request={async (params) => {
          const response = await getMessagesList({
            userId: params.userId,
            isRead: params.isRead,
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
        title="消息详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentMessage && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="发送者" span={2}>
              <Space>
                <UserOutlined />
                <span>{currentMessage.senderId.name}</span>
                <span style={{ color: '#666' }}>
                  ({currentMessage.senderId.email})
                </span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="接收者" span={2}>
              <Space>
                <UserOutlined />
                <span>{currentMessage.receiverId.name}</span>
                <span style={{ color: '#666' }}>
                  ({currentMessage.receiverId.email})
                </span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="消息内容" span={2}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {currentMessage.content}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="消息类型">
              <Tag
                color={
                  currentMessage.type === 'text'
                    ? 'blue'
                    : currentMessage.type === 'image'
                    ? 'green'
                    : 'orange'
                }
              >
                {currentMessage.type === 'text'
                  ? '文本'
                  : currentMessage.type === 'image'
                  ? '图片'
                  : '文件'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="已读状态">
              <Tag color={currentMessage.isRead ? 'green' : 'red'}>
                {currentMessage.isRead ? '已读' : '未读'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发送时间">
              {dayjs(currentMessage.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            {currentMessage.readAt && (
              <Descriptions.Item label="阅读时间">
                {dayjs(currentMessage.readAt).format('YYYY-MM-DD HH:mm')}
              </Descriptions.Item>
            )}
            {currentMessage.attachments &&
              currentMessage.attachments.length > 0 && (
                <Descriptions.Item label="附件" span={2}>
                  <Space wrap>
                    {currentMessage.attachments.map((attachment, index) => (
                      <Tag key={index} color="blue">
                        {attachment}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
              )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Messages;
