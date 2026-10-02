const TituloPagina = ({ titulo, color }) => {
  return (
    <h1 className={`text-3xl md:text-4xl font-bold mb-4 transition-all text-center pt-6 ${color ?? "text-gray-800"}`}>
      {titulo}
    </h1>
  );
};

export default TituloPagina;