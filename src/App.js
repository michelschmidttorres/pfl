import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const sdkContainer = useRef();

  const { PassiveFaceLivenessSdk } = window["@combateafraude/passive-face-liveness"];

  const sdkToken = "";

  const sdkOptions = {
    token: sdkToken,
    language: "pt-BR",
    environmentSettings: {
      disableVisibilityChangeSecurity: true,
      disableFaceDetectionSecurity: true,
    },
    capturerSettings: {
      disableAdvancedCapturing: true,
      disableVideoCapturing: true,
    },
  };

  const passiveFaceLiveness = new PassiveFaceLivenessSdk(sdkOptions);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pflInitializer = async () => {
    try {
      await passiveFaceLiveness.initialize();
      setIsInitialized(true);
    } catch {
      setIsInitialized(false);
    }
  }

  const pflCapture = async () => {
    try {
      await pflInitializer();
        const result = await passiveFaceLiveness.capture(
          sdkContainer.current,
          [
            {
              mode: "automatic",
              attempts: 0,
              duration: 30,
            },
            {
              mode: "manual",
              attempts: 0,
              duration: 0,
            },
          ],
          {
            personData: {
              personID: "33344455566",
            },
          },
        );

        console.log("RESULT:", result);
        setHasResult(result);

      } catch (e) { console.log("Catch error:", e) }
  }

  console.log("DIV Container:", sdkContainer.current);
  console.log("Initialized:", isInitialized);

  const closeSdk = async () => {
    await passiveFaceLiveness.dispose();
    setIsInitialized(false);
  }

  useEffect(() => {
    if (!!hasResult) {
      if (isInitialized) {
        closeSdk();
      }
    }
  }, [hasResult])

  return (
    <div className="App">
      <header className="App-header">
        {hasResult ? <>
          Veja as informações do retorno no Dev Tools na aba Console
        </> : <>
          <button onClick={pflCapture}>Iniciar</button>
          <div ref={sdkContainer}></div>
        </>}
      </header>
    </div>
  );
}

export default App;
