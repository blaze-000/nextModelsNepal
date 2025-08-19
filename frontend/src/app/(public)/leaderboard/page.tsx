import Breadcrumb from "@/components/molecules/breadcumb";
import React from "react";

export default function page() {
  return (
    <main>
      <Breadcrumb
        title="Events Central"
        searchPlaceholder="Search events, winners, judges"
      />
    </main>
  );
};
