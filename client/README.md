# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

 useEffect(() => {
    const fetchAPI = async () => {
      const dataSubmit = { subjectGroupID: classCode };
      try {
        const res = await request.post("leave/history", dataSubmit);
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAPI();
  }, []);

  SELECT T.teachingStatusWeek, GROUP_CONCAT(SG.subjectGroupID)
FROM teachingstatus T
LEFT JOIN subjectgroup SG ON T.subjectGroupID = SG.subjectGroupID
LEFT JOIN compensationschedule C ON C.teachingStatusID = T.teachingStatusID
GROUP BY T.teachingStatusWeek;