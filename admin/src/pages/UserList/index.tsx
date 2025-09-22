import { PageContainer, ProTable } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import { Tag, Tooltip } from 'antd';

const UserList = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
    },
    {
      title: '专业',
      dataIndex: 'profession',
      key: 'profession',
      width: 120,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 150,
    },
    {
      title: '公司',
      dataIndex: 'company',
      key: 'company',
      width: 150,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: '兴趣爱好',
      dataIndex: 'interests',
      key: 'interests',
      width: 150,
      render: (interests: string[]) => (
        <div>
          {interests.map((interest, index) => (
            <Tag key={index} size="small" style={{ margin: '2px' }}>
              {interest}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '履历',
      dataIndex: 'experience',
      key: 'experience',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 150,
      render: (tags: string[]) => (
        <div>
          {tags.map((tag, index) => (
            <Tag
              key={index}
              color="blue"
              size="small"
              style={{ margin: '2px' }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={async () => {
          const response = await request('/admin/user-list');
          return {
            data: response.data,
            success: response.code === 200,
            total: response.data.length,
          };
        }}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>
  );
};

export default UserList;
