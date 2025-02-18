import styled, { css } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  border-left: solid #494949 1px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > button {
    background-color: inherit;
    border: none;
  }
`;

export const SectionCollapseBtn = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.5em 1em;
  font-size: 1em;
  font-family: inherit;
  font-weight: 500;
  display: flex;
  align-items: center;
  display: flex;
  gap: 0.2em;
  cursor: pointer;
`;

export const SectionAddBtn = styled.button`
  margin-right: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.4em;
  width: 2em;
  height: 2em;
  border-radius: 0.3em;
  &:hover {
    background-color: #494949;
  }
`;

export const Section = styled.div`
  border-bottom: solid #494949 1px;
  > div {
    overflow: auto;
  }
`;

export const TabContent = styled.div`
  background-color: #1A1A1A;
  border-left: solid #494949 1px;
  height: 100%;
`;

export const TabButtonContainer = styled.div`
  background-color: #0B0B0B;
`;

export const TabButton = styled.button<{ $selected?: boolean }>`
  border: none;
  padding: 0.5em 1em;

  &:first-child {
    border-left: solid #494949 1px;
    border-radius: 0.2em 0 0 0;
  }
  &:last-child {
    border-radius: 0 0.2em 0 0;
  }

  ${({$selected}) => $selected ? 
    css`
      background-color: #1A1A1A;
      color: #D9D9D9;
    ` : 
    css`
      cursor: pointer;
      background-color: #0B0B0B;
      color: #808080;
      &:hover {
        color: #D9D9D9;
      }
    `
}
`;

export const SideBarSection = styled.div``;