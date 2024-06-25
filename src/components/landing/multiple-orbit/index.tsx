import Orbit from "../orbit";

const MultipleOrbit = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center -z-50">
      <Orbit
        speed={50}
        radius={300}
        items={[
          <div key={0} className="w-4 h-4 bg-red-500 rounded-full" />,
          <div key={1} className="w-4 h-4 bg-blue-500 rounded-full" />,
          <div key={2} className="w-4 h-4 bg-green-500 rounded-full" />,
          <div key={3} className="w-4 h-4 bg-yellow-500 rounded-full" />,
          <div key={4} className="w-4 h-4 bg-orange-500 rounded-full" />,
          <div key={5} className="w-4 h-4 bg-purple-500 rounded-full" />,
        ]}
      >
        <Orbit
          speed={70}
          radius={200}
          items={[
            <div key={0} className="w-4 h-4 bg-red-500 rounded-full" />,
            <div key={1} className="w-4 h-4 bg-blue-500 rounded-full" />,
            <div key={2} className="w-4 h-4 bg-green-500 rounded-full" />,
            <div key={3} className="w-4 h-4 bg-yellow-500 rounded-full" />,
            <div key={4} className="w-4 h-4 bg-orange-500 rounded-full" />,
            <div key={5} className="w-4 h-4 bg-purple-500 rounded-full" />,
          ]}
        >
          <Orbit
            speed={90}
            radius={100}
            items={[
              <div key={0} className="w-4 h-4 bg-red-500 rounded-full" />,
              <div key={1} className="w-4 h-4 bg-blue-500 rounded-full" />,
              <div key={2} className="w-4 h-4 bg-green-500 rounded-full" />,
              <div key={3} className="w-4 h-4 bg-yellow-500 rounded-full" />,
              <div key={4} className="w-4 h-4 bg-orange-500 rounded-full" />,
              <div key={5} className="w-4 h-4 bg-purple-500 rounded-full" />,
            ]}
          />
        </Orbit>
      </Orbit>
    </div>
  );
};

export default MultipleOrbit;
