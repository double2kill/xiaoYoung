import {
  createCommunity,
  deleteCommunity,
  getCommunityList,
  updateCommunity,
  type CommunityItem,
} from '@/services/community';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Rate,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

const Community: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CommunityItem | null>(null);
  const [form] = Form.useForm();

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const result = await getCommunityList();
      if (result.code === 200) {
        setCommunities(result.data);
      } else {
        message.error('获取校友会列表失败');
      }
    } catch (error) {
      message.error('网络错误');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteCommunity(id);
      if (result.code === 200) {
        message.success('删除成功');
        fetchCommunities();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('网络错误');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        rating: Array(5)
          .fill(false)
          .map((_, index) => index < values.rating),
        createTime: new Date().toISOString().split('T')[0],
        lastActiveTime: new Date().toISOString().split('T')[0],
      };

      let result;
      if (editingItem) {
        result = await updateCommunity(editingItem.id, data);
      } else {
        result = await createCommunity(data);
      }

      if (result.code === 200) {
        message.success(editingItem ? '更新成功' : '创建成功');
        setModalVisible(false);
        form.resetFields();
        fetchCommunities();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (item: CommunityItem) => {
    setEditingItem(item);
    form.setFieldsValue({
      ...item,
      rating: item.rating.filter(Boolean).length,
    });
    setModalVisible(true);
  };

  const renderRating = (rating: boolean[]) => {
    return (
      <div>
        {rating.map((star, index) => (
          <span key={index} style={{ color: star ? '#faad14' : '#d9d9d9' }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const columns: ColumnsType<CommunityItem> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '成员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      width: 100,
      sorter: (a, b) => a.memberCount - b.memberCount,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: renderRating,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveTime',
      key: 'lastActiveTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个校友会吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>校友会管理</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          新增校友会
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={communities}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingItem ? '编辑校友会' : '新增校友会'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="校友会名称"
            rules={[{ required: true, message: '请输入校友会名称' }]}
          >
            <Input placeholder="请输入校友会名称" />
          </Form.Item>

          <Form.Item
            name="memberCount"
            label="成员数量"
            rules={[{ required: true, message: '请输入成员数量' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入成员数量"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="rating"
            label="评分"
            rules={[{ required: true, message: '请选择评分' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="contactName"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人' }]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入校友会描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Community;
