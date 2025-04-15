import VerificationRequestCard from "./VerificationRequestCard";
import { ClipboardList } from "lucide-react";
import EmptyState from "../EmptyState/EmptyState";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from 'react';

const GET_VERIFICATION_REQUESTS = gql`
  query GetVerificationRequests {
    getAllRequests {
      mentorId
      requestId
      status
    }
  }
`;

const VerificationRequestList = () => {
  const { loading, data } = useQuery(GET_VERIFICATION_REQUESTS);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    console.log(loading, data);
    if (data) {
      setRequests(data.getAllRequests);
    }
  }, [data, loading]);

  if (
    requests &&
    requests &&
    requests.length === 0
  ) {
    return (
      <EmptyState
        title="Нет запросов на верификацию"
        description="В настоящее время у вас нет запросов на верификацию, требующих рассмотрения."
        icon={<ClipboardList className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {requests && requests
        ? requests.map(
            (request: any, index: number) => (
              <VerificationRequestCard key={index} request={{id: request.requestId, userId: request.mentorId}} />
            )
          )
        : ""}
    </div>
  );
};

export default VerificationRequestList;
