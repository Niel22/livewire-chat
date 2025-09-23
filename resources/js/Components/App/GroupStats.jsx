import { formatNumber } from "@/helpers";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const GroupStats = ({ totalMembers }) => {
  const { t } = useTranslation("convo");
  const [activeMembers, setActiveMembers] = useState(
    Math.floor(totalMembers * 0.6)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMembers((prev) => {
        const fluctuation = Math.floor(
          (Math.random() * 0.1 - 0.05) * totalMembers
        );

        let next = prev + fluctuation;
        const min = 1;
        const max = totalMembers;

        if (next < min) next = min;
        if (next > max) next = max;

        return next;
      });
    }, Math.floor(Math.random() * 3000) + 1000);

    return () => clearInterval(interval);
  }, [totalMembers]);

  return (
    <div className="text-xs flex flex-col md:flex-row md:items-center md:gap-3 text-gray-500 dark:text-gray-400">
      <p>{t("stats.members", { count: formatNumber(totalMembers) })}</p>
      <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
        {t("stats.active", { count: formatNumber(activeMembers) })}
      </p>
    </div>
  );
};

export default GroupStats;
