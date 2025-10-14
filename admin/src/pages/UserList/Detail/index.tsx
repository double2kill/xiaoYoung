import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from '@ant-design/pro-components';
import { history, request } from '@umijs/max';
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Tag,
} from 'antd';
import { useEffect, useState } from 'react';

const UserDetail = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();

  const pathname = history.location.pathname;
  const id = pathname.split('/').pop() || '';

  useEffect(() => {
    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const response = await request(`/admin/users/${id}`);
      if (response.code === 200) {
        setUser(response.data);
        editForm.setFieldsValue(response.data);
      } else {
        message.error('获取用户详情失败');
      }
    } catch (error) {
      message.error('获取用户详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      await request(`/admin/users/${id}`, {
        method: 'PUT',
        data: values,
      });
      message.success('用户信息更新成功');
      setEditModalVisible(false);
      fetchUserDetail();
    } catch (error) {
      message.error('用户信息更新失败');
    }
  };

  const handleBack = () => {
    history.push('/user-list');
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!user) {
    return <div>用户不存在</div>;
  }

  return (
    <PageContainer
      title="用户详情"
      extra={[
        <Button key="back" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          返回列表
        </Button>,
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          onClick={handleEdit}
        >
          编辑用户
        </Button>,
      ]}
    >
      <ProCard>
        <div
          style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}
        >
          <Avatar
            size={80}
            src={user.avatar || '/images/default-avatar.png'}
            icon={<UserOutlined />}
            style={{ marginRight: 16 }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>
              {user.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>
              @{user.username}
            </p>
            {user.company && (
              <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: 12 }}>
                {user.company} · {user.position}
              </p>
            )}
          </div>
        </div>

        <ProDescriptions
          title="基本信息"
          dataSource={user}
          columns={[
            {
              title: '用户名',
              dataIndex: 'username',
              copyable: true,
            },
            {
              title: '姓名',
              dataIndex: 'name',
            },
            {
              title: '邮箱',
              dataIndex: 'email',
              copyable: true,
            },
            {
              title: '电话',
              dataIndex: 'phone',
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                  {status === 'active' ? '活跃' : '非活跃'}
                </Tag>
              ),
            },
            {
              title: '角色',
              dataIndex: 'role',
              render: (role: string) => (
                <Tag color="blue">
                  {role === 'admin' ? '管理员' : '普通用户'}
                </Tag>
              ),
            },
          ]}
        />
      </ProCard>

      <ProCard style={{ marginTop: 16 }}>
        <ProDescriptions
          title="职业信息"
          dataSource={user}
          columns={[
            {
              title: '公司',
              dataIndex: 'company',
            },
            {
              title: '职位',
              dataIndex: 'position',
            },
            {
              title: '部门',
              dataIndex: 'department',
            },
            {
              title: '行业',
              dataIndex: 'industry',
            },
            {
              title: '职业',
              dataIndex: 'profession',
            },
            {
              title: '经验',
              dataIndex: 'experience',
              span: 2,
            },
          ]}
        />
      </ProCard>

      <ProCard style={{ marginTop: 16 }}>
        <ProDescriptions
          title="联系信息"
          dataSource={user}
          columns={[
            {
              title: '微信号',
              dataIndex: 'wechatId',
            },
            {
              title: '兴趣',
              dataIndex: 'interests',
              render: (interests: string[]) => (
                <Space wrap>
                  {interests?.map((interest, index) => (
                    <Tag key={index} color="purple">
                      {interest}
                    </Tag>
                  ))}
                </Space>
              ),
            },
            {
              title: '标签',
              dataIndex: 'tags',
              render: (tags: string[]) => (
                <Space wrap>
                  {tags?.map((tag, index) => (
                    <Tag key={index} color="orange">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              ),
            },
          ]}
        />
      </ProCard>

      <ProCard style={{ marginTop: 16 }}>
        <ProDescriptions
          title="系统信息"
          dataSource={user}
          columns={[
            {
              title: '用户ID',
              dataIndex: 'id',
              copyable: true,
            },
            {
              title: '创建时间',
              dataIndex: 'createTime',
            },
            {
              title: '最后登录时间',
              dataIndex: 'lastLoginTime',
            },
            {
              title: '登录次数',
              dataIndex: 'loginCount',
            },
            {
              title: '是否删除',
              dataIndex: 'isDeleted',
              render: (isDeleted: boolean) => (
                <Tag color={isDeleted ? 'red' : 'green'}>
                  {isDeleted ? '已删除' : '正常'}
                </Tag>
              ),
            },
          ]}
        />
      </ProCard>

      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={editForm} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="电话">
            <Input />
          </Form.Item>

          <Form.Item name="avatar" label="头像URL">
            <Input placeholder="请输入头像链接" />
          </Form.Item>

          <Form.Item name="company" label="公司">
            <Input />
          </Form.Item>

          <Form.Item name="position" label="职位">
            <Input />
          </Form.Item>

          <Form.Item name="department" label="部门">
            <Input />
          </Form.Item>

          <Form.Item name="industry" label="行业">
            <Select placeholder="请选择行业" allowClear>
              <Select.Option value="互联网">互联网</Select.Option>
              <Select.Option value="金融">金融</Select.Option>
              <Select.Option value="教育">教育</Select.Option>
              <Select.Option value="医疗">医疗</Select.Option>
              <Select.Option value="制造业">制造业</Select.Option>
              <Select.Option value="房地产">房地产</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="profession" label="职业">
            <Input />
          </Form.Item>

          <Form.Item name="wechatId" label="微信号">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="active">活跃</Select.Option>
              <Select.Option value="inactive">非活跃</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="role" label="角色">
            <Select>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button onClick={() => setEditModalVisible(false)}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UserDetail;
