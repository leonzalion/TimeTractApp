import {useState} from 'react';
import {useQuery} from "@apollo/react-hooks";
import gql from 'graphql-tag';

const QUERY_RESCUETIME_DATA = gql`
  query($id: ID) {
    user(id: $id) {
      rescueTimeData {
        productiveTime
        distractingTime
        topSites {
          name
          category
          productivity
          timeSpent
        }
      }
    }
  }
`;

export default function useRescueTimeData() {
  const {refetch} = useQuery(QUERY_RESCUETIME_DATA, {skip: true});
  return async function(user) {
    const {data} = await refetch({id: user.id});
    console.log(data);
    return data.user.rescueTimeData;
  }
}