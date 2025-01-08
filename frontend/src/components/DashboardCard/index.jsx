import React from "react";
import Card from "react-bootstrap/Card";
import "./DashboardCard.css";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DashboardCard = ({ number, Icon, description, loading }) => {
    return (
        <Card className="dashboard-card shadow-sm">
            <Card.Body className="d-flex align-items-center">
                <div className="icon-container me-3">
                    <Icon size={40} color="#007bff" />
                </div>
                <div>
                    {loading ? (
                        <>
                            <Skeleton width={70} height={40} />
                            <Skeleton height={20} />
                        </>
                    ) : (
                        <>
                            <h1 className="mb-0">{number}</h1>
                            <small className="text-muted">{description}</small>
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default DashboardCard;
