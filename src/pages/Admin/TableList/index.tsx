import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, message, Space, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateForm from './components/UpdateForm';
import CreateForm from "./components/CreateForm";
import {deleteUserById, getUserByPage} from "@/services/user-center/userController";

const TableList: React.FC = () => {

  // 是否显示创建用户窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  // 是否显示更新用户窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  // 当前用户的数据
  const [currentRow, setCurrentRow] = useState<API.User>();
  const actionRef = useRef<ActionType>();

  const handleDelete = async (row: API.User) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteUserById({
        id: row.id,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败' + error.message);
      return false;
    }
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      valueType: 'image',
      fieldProps: {
        width: 64,
      },
    },
    {
      title: '性别',
      dataIndex: 'gender',
      valueType: 'text',
      valueEnum: {
        0: {
          text: '男',
          status: 'Processing'
        },
        1: {
          text: '女',
          status: 'Success'
        }
      }
    },
    {
      title: '手机号码',
      dataIndex: 'phone'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '权限',
      dataIndex: 'userRole',
      valueEnum: {
        user: {
          text: '用户',
          status: 'Processing'
        },
        admin: {
          text: '管理员',
          status: 'Success'
        },
        ban: {
          text: '被封号',
          status: 'Error'
        }
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size={"middle"}>
          <Typography.Link
            key="config"
            onClick={() => {
              setUpdateModalVisible(true);
              setCurrentRow(record);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            type="danger"
            onClick={() => {
              handleDelete(record);
            }}
          >
            删除
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.User, API.PageUser>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;
          const {data, code} = await getUserByPage({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.UserQueryRequest);
          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateForm
        modalVisible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateForm
        modalVisible={updateModalVisible}
        columns={columns}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default TableList;
