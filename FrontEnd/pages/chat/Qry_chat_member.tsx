import React, { useContext, useEffect } from "react";
import { ButtonToolbar } from "reactstrap";
import {
  Column,
  Tree,
  ProgramContext,
  ProgramProvider,
  Form,
  BtnQuery,
  PublicMethod,
  Row,
  Label,
  TextBox,
  DataTable,
  SystemContext,
} from "../../resource/index";
import "ds-widget/dist/index.css";

export default function Qry_chat_member({ account_uid, callback }) {
  return (
    <ProgramProvider>
      <Qry_chat_member_Content account_uid={account_uid} callback={callback} />
    </ProgramProvider>
  );
}

function Qry_chat_member_Content({ account_uid, callback }) {
  const { System } = useContext(SystemContext);
  const { Program } = useContext(ProgramContext);

  useEffect(() => {
    if (callback) {
      callback(Program.selectedData);
    }
  }, [Program.selectedData]);

  return (
    <>
      <Column md={12}>
        <Form
          program_code="Qry_chat_member"
          dataKey={["account_uid"]}
          individual={true}
        >
          <Column></Column>
        </Form>
      </Column>

      <Column md={12}>
        <Row>
          <Column md={12}>
            <ButtonToolbar>
              <BtnQuery
                queryApi="/chat/qry_memberList"
                defaultQueryParameters={{ account_uid: account_uid }}
                disableFilter={async () => false}
              />
            </ButtonToolbar>
          </Column>
          <Column>
            <Label
              text={System.getLocalization("system_administrator", "ACCOUNT")}
            />
            <TextBox maxLength={20} query={true} name="searchAccount" />
          </Column>
        </Row>
      </Column>
      <Column md={12}>
        <Column>
          <DataTable
            bind={true}
            data={Program.data}
            columns={[
              {
                dataField: "account_uid",
                text: System.getLocalization("system_administrator", "ACCOUNT"),
                sort: true,
                hidden: true,
              },
              {
                dataField: "name",
                text: System.getLocalization("system_administrator", "NAME"),
                sort: true,
              },
            ]}
          />
        </Column>
      </Column>
    </>
  );
}
