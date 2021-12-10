import styled from "@emotion/styled";
import { GENERICS, MIXINS } from "../GlobalStyle";

interface EditorProps {
  disabled: boolean;
}

export const ListNoteStyled = styled.div`
height: 100%;
  width: 100%;
  max-width: 350px;
  color: ${GENERICS.colorBlackCalm};
  background-color: ${GENERICS.bgColor};
  display: flex;
  flex-direction: column;
  > h2 {
    font-weight: normal;
    padding: 0.8em;
  }
  .note-filter {
    ${MIXINS.va("space-between")}
    padding: 0.5em 1.2em;
    border-bottom: 0.1em solid #ccc;
    .filters span {
      cursor: pointer;
      padding: 0.3em;
    }
  }
  .list-notes {
    overflow-y: auto;
    height: 100%;
    .active {
      background-color: #fff;
    }
    .note {
      cursor: pointer;
      padding: 1em;
      border-bottom: ${GENERICS.border};
      color: ${GENERICS.colorGray};
      ${MIXINS.va("space-between")}
      &:hover {
        background-color: #eee;
        .delete-btn {
          visibility: visible;
        }
      }
      .note-detail {
        > div {
          margin-bottom: 0.4em;
        }
        .note-title {
          color: ${GENERICS.colorBlackCalm};
          font-weight: bold;
        }
      }
      .delete-btn {
        visibility: hidden;
        cursor: pointer;
        padding: 0.9em;
        &:hover {
          transition: 0.3s;
          color: red;
        }
      }
    }
  }

`;

export const EditorContainer = styled.div<EditorProps>`
width: 100%;
  > input {
    border: none;
    outline: none;
    padding: 0.5em;
    font-size: 2em;
    width: 100%;
    &:disabled {
      background: transparent;
      cursor: not-allowed;
    }
  }
  .saving-text {
    padding-left: 1.2em;
    padding-top: 0em;
    font-style: italic;
  }
  .ql-toolbar,
  .ql-container {
    border: none !important;
  }
  .quill,
  .ql-container {
    font-size: 1em;
    height: 100%;
    cursor: ${(props: any) => (props.disabled ? "not-allowed;" : "unset")};
  }
  .ql-toolbar,
  .ql-editor p {
    cursor: ${(props: any) => (props.disabled ? "not-allowed;" : "unset")};
  }
`;