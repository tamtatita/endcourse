import React from "react";

const GanttComponent = () => {
  const data = [
    {
      id: 1,
      title: "Tổng quan cơ sở dữ liệu",
      children: [
        { idSub: 1, nameSub: "Bài giảng mẫu", weeks: 1 },
        { idSub: 2, nameSub: "Bài giảng mẫu", weeks: 1 },
        { idSub: 3, nameSub: "Bài giảng mẫu", weeks: 2 },
        { idSub: 4, nameSub: "Bài giảng mẫu", weeks: 2 },
      ],
    },
    {
      id: 2,
      title: "SQL",
      children: [
        { idSub: 5, nameSub: "Bài giảng mẫu", weeks: 2 },
        { idSub: 6, nameSub: "Bài giảng mẫu", weeks: 3 },
        { idSub: 7, nameSub: "Bài giảng mẫu", weeks: 4 },
        { idSub: 8, nameSub: "Bài giảng mẫu", weeks: 4 },
      ],
    },
    {
      id: 3,
      title: "Mối quan hệ",
      children: [
        { idSub: 9, nameSub: "Bài giảng mẫu", weeks: 5 },
        { idSub: 10, nameSub: "Bài giảng mẫu", weeks: 5 },
        { idSub: 11, nameSub: "Bài giảng mẫu", weeks: 6 },
        { idSub: 12, nameSub: "Bài giảng mẫu", weeks: 7 },
      ],
    },
  ];

  const maxCountWeek = Math.max(
    ...data.map(item => {
      if (item.children) {
        return Math.max(...item.children.map(child => child.weeks));
      }
      return 0;
    })
  );
  return <div>
    {data.map(item => (
      <div key={item.id} style={{ display: 'flex' }}>
        <div className="bg-red-500" style={{ width: `${item.children[0].weeks * 100 / maxCountWeek}%` }}>
          {item.title}
        </div>
        {item.children.map(child => (
          <div className="bg-yellow-500" key={child.idSub} style={{ width: `${child.weeks * 100 / maxCountWeek}%` }}>
            {child.nameSub}
          </div>
        ))}
      </div>
    ))}
  </div>;
};

export default GanttComponent;
