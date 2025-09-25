import {
  deleteDynamic,
  getDynamicsList,
  type DynamicItem,
} from '@/services/dynamics';
import {
  DeleteOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Descriptions,
  Image,
  message,
  Modal,
  Popconfirm,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';

const Dynamics: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDynamic, setCurrentDynamic] = useState<DynamicItem | null>(
    null,
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteDynamic(id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const showDetail = (record: DynamicItem) => {
    setCurrentDynamic(record);
    setDetailModalVisible(true);
  };

  const columns: ProColumns<DynamicItem>[] = [
    {
      title: '内容',
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
      title: '作者',
      dataIndex: ['authorId', 'name'],
      key: 'authorName',
      width: 120,
    },
    {
      title: '所属圈子',
      dataIndex: ['groupId', 'name'],
      key: 'groupName',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '图片数量',
      dataIndex: 'images',
      key: 'imageCount',
      width: 100,
      render: (images: string[]) => images?.length || 0,
    },
    {
      title: '互动数据',
      key: 'interactions',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>
            <HeartOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
            {record.likes}
          </div>
          <div>
            <MessageOutlined style={{ color: '#1890ff', marginRight: 4 }} />
            {record.comments}
          </div>
          <div>
            <ShareAltOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            {record.shares}
          </div>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          published: { color: 'green', text: '已发布' },
          draft: { color: 'orange', text: '草稿' },
          hidden: { color: 'red', text: '隐藏' },
        };
        const config = statusMap[status as keyof typeof statusMap] || {
          color: 'default',
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '发布时间',
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
            title="确定要删除这条动态吗？"
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
      <ProTable<DynamicItem>
        headerTitle="动态列表"
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1200 }}
        request={async (params) => {
          const response = await getDynamicsList({
            groupId: params.groupId,
            authorId: params.authorId,
          });
          return {
            data: response.data,
            success: true,
            total: response.data.length,
          };
        }}
        columns={columns}
      />

      <Modal
        title="动态详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentDynamic && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="内容" span={2}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {currentDynamic.content}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="作者">
              {currentDynamic.authorId.name}
            </Descriptions.Item>
            <Descriptions.Item label="所属圈子">
              {currentDynamic.groupId?.name || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag
                color={
                  currentDynamic.status === 'published'
                    ? 'green'
                    : currentDynamic.status === 'draft'
                    ? 'orange'
                    : 'red'
                }
              >
                {currentDynamic.status === 'published'
                  ? '已发布'
                  : currentDynamic.status === 'draft'
                  ? '草稿'
                  : '隐藏'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {dayjs(currentDynamic.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="互动数据" span={2}>
              <Space>
                <span>
                  <HeartOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                  点赞: {currentDynamic.likes}
                </span>
                <span>
                  <MessageOutlined
                    style={{ color: '#1890ff', marginRight: 4 }}
                  />
                  评论: {currentDynamic.comments}
                </span>
                <span>
                  <ShareAltOutlined
                    style={{ color: '#52c41a', marginRight: 4 }}
                  />
                  分享: {currentDynamic.shares}
                </span>
              </Space>
            </Descriptions.Item>
            {currentDynamic.images && currentDynamic.images.length > 0 && (
              <Descriptions.Item label="图片" span={2}>
                <Image.PreviewGroup>
                  {currentDynamic.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      width={100}
                      height={100}
                      style={{ marginRight: 8, marginBottom: 8 }}
                    />
                  ))}
                </Image.PreviewGroup>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
};

export default Dynamics;
