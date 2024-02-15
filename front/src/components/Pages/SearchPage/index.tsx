import { useEffect, useMemo, useState } from 'react';
import * as S from './styles';
import { ChannelSearchResponse } from '../../../api/elPatoClipApi/types';
import { useDebouce } from '../../../hooks/useDebounce';
import { Loading } from '../../Atoms/Loading';
import { ElPatoApi } from '../../../api/elPatoClipApi';
import { recentChannelsStore } from '../../../store/recentChannelsStore';

const recentItems = recentChannelsStore.load();

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const searchString = useDebouce(value);
  const [searchResults, setSearchResult] = useState<Array<ChannelSearchResponse>>([]);

  useEffect(() => {
    (async () => {
      if (searchString.trim().length === 0) {
        setSearchResult([]);
        return;
      }
      setIsLoading(true);
      const resp = await ElPatoApi.searchUser(searchString);
      setSearchResult(resp);
      setIsLoading(false);
    })();
  }, [searchString])

  const SearchResults = useMemo(() => {
    if (!searchString.trim()) return null;

    if (isLoading) {
      return (<Loading />);
    }

    if (!searchResults.length) {
      return <div>Not found</div>
    }

    return (
      searchResults
      .sort((prev, next) => {
        const a = next.displayName.toLowerCase()
          .includes(searchString.toLowerCase());

        const b = prev.displayName.toLowerCase()
          .includes(searchString.toLowerCase())

        if (a === b) return 0;
        return (a) ? 1 : -1
      })
      .map((item) => (
        <S.SearchResultItem to={`/clips/${item.id}`} key={item.id}>
          <img alt={item.displayName} src={item.profileImg} />
          {item.displayName}
        </S.SearchResultItem>
    )));
  }, [searchString, searchResults, isLoading]);

  return (
    <S.Page>
      <div>
        <h1>El Pato Clip</h1>
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder='twitch channel name' />
      </div>

      <S.SearchResultContainer>
        {SearchResults}
      </S.SearchResultContainer>

      {!!recentItems.length && (
        <div>
          Recent channels
          {
            recentItems.map((item) => (
              <S.SearchResultItem to={`/clips/${item.id}`} key={item.id}>
                <img alt={item.displayName} src={item.profileImg} />
                {item.displayName}
              </S.SearchResultItem>
            ))
          }
        </div>
      )}
    </S.Page>
  )
}

export default SearchPage;