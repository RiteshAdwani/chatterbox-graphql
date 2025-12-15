import styled from "styled-components";
import { Modal, Select, Input } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 8px;
  }

  .ant-modal-header {
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-modal-title {
    font-size: 18px;
    font-weight: 600;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
`;

export const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    border-radius: 6px;
    min-height: 40px;
  }
`;

export const StyledInput = styled(Input)`
  border-radius: 6px;
  padding: 10px 12px;
`;

export const ChatTypeContainer = styled.div`
  display: flex;
  gap: 12px;
`;

export const ChatTypeButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 12px;
  border: 2px solid ${(props) => (props.$selected ? "#00a884" : "#e0e0e0")};
  background-color: ${(props) => (props.$selected ? "#e7f7f5" : "#ffffff")};
  color: ${(props) => (props.$selected ? "#00a884" : "#666666")};
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #00a884;
    background-color: #e7f7f5;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 168, 132, 0.1);
  }
`;

export const HelperText = styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: #8c8c8c;
`;
